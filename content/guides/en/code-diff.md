Open the [code diff tool](../diff.html). Select plain text and turn off Ignore whitespace and Ignore case. Paste the following inputs into the original and modified panels.

## Original

```text
const Name = "demo";
return 1;
```

## Modified

```text
const   name = "demo";
return 1;
```

Run the comparison. The first line should be marked as changed and the second as unchanged. The first line differs in both whitespace and the case of Name/name.

## Change one option at a time

Enable only Ignore whitespace and compare again. The first line should still differ because case remains significant. Enable Ignore case as well and compare: both lines should be treated as unchanged. Turning both options off should restore the first-line difference.

Ignore whitespace replaces consecutive whitespace within each line with one space and trims its ends. It does not remove every space or merge lines. For example, a b and ab remain different.

## A comparison is not a code audit

Ignoring case can hide a JavaScript identifier change. Ignoring whitespace can hide a Python indentation change. These options narrow your attention; they do not prove semantic or behavioral equivalence. Syntax highlighting only changes the display and does not execute input code.

Empty inputs, a change on only one side and two identical files are useful checks. Synchronized scrolling changes the viewing position, not the comparison rules. Uploaded files are read locally in the browser. Large files use more memory and computing time; compare a smaller function or section first.
