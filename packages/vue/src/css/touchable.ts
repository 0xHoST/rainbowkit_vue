
import { base, hover, active } from './touchable.css'

interface TouchableStylesOptions {
  hover?: keyof typeof hover
  active: keyof typeof active
}

export function touchable({ active: activeKey, hover: hoverKey }: TouchableStylesOptions) {
  return [base, hoverKey && hover[hoverKey], active[activeKey]].join(' ')
}
