import {
  State,
  stateFnDefaultHalt,
  stateFnDefaultNull,
} from './state';
import {
  Transition,
} from './transition';

export function link<C>(
  from: State<C>,
  to: State<C>,
  transition?: Transition<C>,
)
{
  if (from.stateFn() === stateFnDefaultHalt) {
    from.setStateFn(stateFnDefaultNull);
  }

  transition = transition || new Transition();
  from.addTransition(transition);
  transition.setState(to);
}
