import { Instruction } from '@bardsballad/verse';

const RETURN_SENTINEL = Symbol('return');

/**
 * Async JSON instruction processor.
 * Executes Instruction[] produced by @bardsballad/verse JSONCodeGenerator.
 * Supports async context functions and properly awaits them.
 */
export class AsyncJsonProcessor {
  private variables: Map<string, any>;
  private functions: Map<string, { params: string[]; body: Instruction[]; async: boolean }>;
  private context: Record<string, any>;

  constructor(context: Record<string, any>) {
    this.variables = new Map();
    this.functions = new Map();
    this.context = context;
  }

  async process(instructions: Instruction[]): Promise<any> {
    for (const instr of instructions) {
      const result = await this.executeInstruction(instr);
      if (result === RETURN_SENTINEL) return undefined;
      if (result !== undefined) return result;
    }
    return undefined;
  }

  private async executeInstruction(instr: Instruction): Promise<any> {
    switch (instr.type) {
      case 'declare_var':
        this.variables.set(instr.name, await this.evaluate(instr.value));
        break;

      case 'assign':
        this.variables.set(instr.name, await this.evaluate(instr.value));
        break;

      case 'set': {
        const value = await this.evaluate(instr.value);
        this.setNestedProperty(this.context, instr.path, value);
        break;
      }

      case 'if': {
        const cond = await this.evaluate(instr.condition);
        const branch = cond ? instr.then : (instr.else ?? []);
        for (const i of branch) {
          const result = await this.executeInstruction(i);
          if (result !== undefined) return result;
        }
        break;
      }

      case 'for': {
        const iterable = await this.evaluate((instr as any).iterable);
        if (Array.isArray(iterable)) {
          for (const item of iterable) {
            this.variables.set(instr.variable, item);
            for (const i of instr.body) {
              const result = await this.executeInstruction(i);
              if (result !== undefined) return result;
            }
          }
        }
        break;
      }

      case 'return':
        return instr.value !== undefined ? await this.evaluate(instr.value) : RETURN_SENTINEL;

      case 'function_decl':
        this.functions.set(instr.name, { params: instr.params, body: instr.body, async: instr.async });
        break;

      case 'print':
        console.log(await this.evaluate((instr as any).value));
        break;

      case 'throw':
        throw await this.evaluate((instr as any).value);
    }
    return undefined;
  }

  async evaluate(expr: any): Promise<any> {
    if (expr === null || expr === undefined) return expr;
    if (typeof expr !== 'object') return expr;

    switch (expr.type) {
      case 'var': {
        if (this.variables.has(expr.name)) return this.variables.get(expr.name);
        if (expr.name in this.context) return this.context[expr.name];
        return undefined;
      }

      case 'literal':
        return expr.value;

      case 'binary': {
        const left = await this.evaluate(expr.left);
        const right = await this.evaluate(expr.right);
        switch (expr.operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '%': return left % right;
          case '==': return left == right;
          case '!=': return left != right;
          case '<': return left < right;
          case '<=': return left <= right;
          case '>': return left > right;
          case '>=': return left >= right;
          case '&&': return left && right;
          case '||': return left || right;
          default: return 0;
        }
      }

      case 'unary': {
        const operand = await this.evaluate(expr.operand);
        switch (expr.operator) {
          case '-': return -operand;
          case '!': return !operand;
          default: return operand;
        }
      }

      case 'call_expr': {
        if (expr.callee.type === 'var') {
          // Check user-declared functions first
          const fn = this.functions.get(expr.callee.name);
          if (fn) {
            const args = await Promise.all(expr.args.map((a: any) => this.evaluate(a)));
            const oldVars = new Map(this.variables);
            try {
              fn.params.forEach((p: string, i: number) => this.variables.set(p, args[i]));
              for (const i of fn.body) {
                const result = await this.executeInstruction(i);
                if (result !== undefined) return result === RETURN_SENTINEL ? undefined : result;
              }
              return undefined;
            } finally {
              for (const [k, v] of oldVars) this.variables.set(k, v);
            }
          }
          // Check context functions
          const ctxFn = this.context[expr.callee.name];
          if (typeof ctxFn === 'function') {
            const args = await Promise.all(expr.args.map((a: any) => this.evaluate(a)));
            return await ctxFn(...args);
          }
          return null;
        } else if (expr.callee.type === 'member_access') {
          const obj = await this.evaluate(expr.callee.object);
          const method = expr.callee.computed
            ? await this.evaluate(expr.callee.property)
            : expr.callee.property;
          if (obj && typeof obj[method] === 'function') {
            const args = await Promise.all(expr.args.map((a: any) => this.evaluate(a)));
            return await obj[method].apply(obj, args);
          }
          return null;
        }
        return null;
      }

      case 'member_access': {
        const obj = await this.evaluate(expr.object);
        const prop = expr.computed ? await this.evaluate(expr.property) : expr.property;
        return obj?.[prop];
      }

      case 'array':
        return await Promise.all(expr.elements.map((e: any) => this.evaluate(e)));

      case 'object': {
        const result: Record<string, any> = {};
        for (const p of expr.properties) {
          result[p.key] = await this.evaluate(p.value);
        }
        return result;
      }

      case 'await':
        return await this.evaluate(expr.expression);

      case 'arrow_function':
        return async (...args: any[]) => {
          const oldVars = new Map(this.variables);
          try {
            expr.params.forEach((p: string, i: number) => this.variables.set(p, args[i]));
            return await this.evaluate(expr.body);
          } finally {
            for (const [k, v] of oldVars) this.variables.set(k, v);
          }
        };

      case 'conditional': {
        const cond = await this.evaluate(expr.condition);
        return cond ? await this.evaluate(expr.then) : await this.evaluate(expr.else);
      }

      default:
        return expr;
    }
  }

  private setNestedProperty(obj: any, path: string[], value: any): void {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] == null) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  }
}
