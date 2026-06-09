type State = 'idle' | 'selected' | 'correct' | 'wrong'
interface Props { label: string; text: string; state: State; onClick: () => void }

export function OptionButton({ label, text, state, onClick }: Props) {
  const styles: Record<State, string> = {
    idle:     'border-ninja-border bg-white text-ninja-text',
    selected: 'border-brand-primary bg-brand-light text-brand-primary',
    correct:  'border-green-500 bg-green-50 text-green-700 option-correct',
    wrong:    'border-red-400 bg-red-50 text-red-600 option-wrong',
  }
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 ${styles[state]}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
        style={{ background: state === 'selected' ? '#2D7A3A' : state === 'correct' ? '#22C55E' : '#F5F5F5',
                 color: ['selected','correct'].includes(state) ? 'white' : '#757575' }}>
        {label}
      </div>
      <span className="font-bold text-sm flex-1">{text}</span>
      {state === 'correct' && <span className="text-green-500 text-lg">✓</span>}
    </button>
  )
}
