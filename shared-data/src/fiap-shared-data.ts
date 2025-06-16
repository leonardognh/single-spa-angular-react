import { BehaviorSubject } from "rxjs";

export const $test = new BehaviorSubject("");

export function eventTest(value) {
  $test.next(value);
}
