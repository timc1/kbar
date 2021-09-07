export function swallowEvent(event) {
  event.stopPropagation();
  event.preventDefault();
}
