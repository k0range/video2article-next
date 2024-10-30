import closeEffect from './closeEffect';

export default (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeEffect();
  }
}