import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface Props {
  result: any,
  expectedType: string
  returnType: string
}

export function InfoBar({ result, expectedType, returnType }: Props) {
  return (
    <Card className={`p-4 transition-colors ${
      result.isCorrect 
        ? 'bg-green-950/30 border-green-900/50'
        : 'bg-orange-950/30 border-orange-900/50'
    }`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground font-medium">Expected:</span>
          <Badge variant="outline" className="font-mono bg-green-500/10 text-green-400 border-green-500/30">
            {expectedType}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground font-medium">Current:</span>
          <Badge 
            variant="outline" 
            className={`font-mono transition-colors ${
              result.isCorrect 
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
            }`}
          >
            {returnType}
          </Badge>
        </div>
        <div className={`flex items-center gap-2 ml-auto text-sm font-medium transition-colors ${
          result.isCorrect ? 'text-green-400' : 'text-orange-400'
        }`}>
          <span className="text-lg">{result.isCorrect ? '✓' : '⚠'}</span>
          <span>{result.isCorrect ? 'Types match' : 'Type mismatch'}</span>
        </div>
      </div>
    </Card>
  )
}