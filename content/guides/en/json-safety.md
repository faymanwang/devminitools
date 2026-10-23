Open the [JSON formatter](../json-format.html) and paste this synthetic input. Formatting runs automatically; you can also click Format.

```json
{"name":"demo","items":[{"id":"9007199254740993","active":true}]}
```

## Inspect the tree

Expand items and its first entry. The ID should remain a string and active should be a boolean. Collapsing a node only changes its display. Copy and download produce the complete result, including collapsed children.

Minify should produce a single line with the same fields and values. Converting to YAML, XML or a type definition requires a separate review of the target format's meaning.

## Syntax errors and precision risks are different

```json
{"name":"demo",}
```

The trailing comma must produce an error. JSON does not support comments, single quotes or trailing commas. Error wording and position information depend on the browser.

```json
{"id":9007199254740993}
```

This is valid JSON syntax, but its number exceeds JavaScript's safe integer range. The tool blocks automatic formatting, minification and conversion rather than silently changing the identifier. Quote the ID and all digits should remain intact.

## Limits of the safety check

Extremely large exponents that become non-finite values are also rejected. Ordinary decimals still follow JavaScript floating-point rules. This is not an arbitrary-precision converter or a financial calculator. Avoid duplicate object keys: standard parsing keeps the later value.

Successful parsing does not prove that fields are complete, a signature is valid or an API contract is satisfied. Store order numbers, account identifiers and database IDs as strings at the source. Digits already rounded by other software cannot be recovered here.
