let evalErrorButton = document.getElementById('eval-error');
let internalErrorButton = document.getElementById('internal-error');
let rangeErrorButton = document.getElementById('range-error');
let referenceErrorButton = document.getElementById('reference-error');
let syntaxErrorButton = document.getElementById('syntax-error');
let typeErrorButton = document.getElementById('type-error');
let uriErrorButton = document.getElementById('uri-error');
let securityErrorButton = document.getElementById('security-error');
let otherErrorButton = document.getElementById('other-error');

evalErrorButton.onclick = () => {
  throw EvalError("custom eval error");
}

internalErrorButton.onclick = () => {
  throw InternalError("custom internal error");
}

rangeErrorButton.onclick = () => {
  throw RangeError("custom range error");
}

referenceErrorButton.onclick = () => {
  throw ReferenceError("custom reference error");
}

syntaxErrorButton.onclick = () => {
  throw SyntaxError("custom syntax error");
}

typeErrorButton.onclick = () => {
  throw TypeError("custom type error");
}

uriErrorButton.onclick = () => {
  throw URIError("custom URI error");
}

securityErrorButton.onclick = () => {
  throw new DOMException("custom security issues", "SecurityError");
}

otherErrorButton.onclick = () => {
  throw "Some other error!";
}
