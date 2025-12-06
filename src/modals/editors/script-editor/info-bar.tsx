
interface Props {
  result: any,
  expectedType: string
  returnType: string
}

export function InfoBar({ result, expectedType, returnType }: Props) {
  return (
    <div className={`px-6 py-3 border-b flex items-center gap-4 transition-colors ${
      result.isCorrect 
        ? 'bg-green-950/30 border-green-900/50'
        : 'bg-orange-950/30 border-orange-900/50'
    }`}>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 font-medium">Expected:</span>
        <span className="text-green-400 font-mono font-semibold bg-green-500/10 px-2.5 py-1 rounded border border-green-500/30">
          {expectedType}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 font-medium">Current:</span>
        <span className={`font-mono font-semibold px-2.5 py-1 rounded border transition-colors ${
          result.isCorrect 
            ? 'text-green-400 bg-green-500/10 border-green-500/30'
            : 'text-orange-400 bg-orange-500/10 border-orange-500/30'
        }`}>
          {returnType}
        </span>
      </div>
      <div className={`flex items-center gap-1.5 ml-auto text-sm transition-colors ${
        result.isCorrect ? 'text-green-400' : 'text-orange-400'
      }`}>
        <span>{result.isCorrect ?  '✓': '⚠'}</span>
        <span>{result.isCorrect ? 'Types match' : 'Type mismatch'}</span>
      </div>
    </div>
  )
}