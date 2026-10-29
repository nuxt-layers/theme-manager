"""Validate Markdown against the documentation rules (ADR-0004, ADR-0010): headings, In short
summaries, local links, external links only in RESOURCES.md and pinned, no versions or links where
they do not belong, and British spelling."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

root = Path(__file__).resolve().parents[1]
skipped = {".git", "node_modules", ".nuxt", ".output"}
# ADR-0010: these hold no versions, status, plans or external links.
general = {"README.md", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md"}
# ADR-0010: versions and pins live only here.
versioned = {"CHANGELOG.md", "CONTRACT.md", "RESOURCES.md"}
link = re.compile(r"!?\[[^\]]*\]\(([^\s)]+)\)")
url = re.compile(r"https?://\S+")
# A release version such as v1.2.3; WCAG criteria (1.4.3) are not versions.
version = re.compile(r"\bv\d+\.\d+(?:\.\d+)?\b")
# ADR-0004: GitHub links are pinned to a full commit or a release tag.
github = re.compile(r"^https?://github\.com/([^/]+)/([^/#?]+)(?:/(.*))?$")
pinned = re.compile(r"^(?:(?:blob|tree|raw)/(?:[0-9a-f]{40}|v\d[\w.-]*)(?:/|$)|releases/tag/v\d|compare/v\d)")
american = re.compile(
    r"\b(colorless|colors?|colored|coloring|behaviors?|behavioral|organizations?|organiz(?:e|ed|es|ing)"
    r"|authoriz\w*|unauthoriz\w*|normaliz\w*|serializ\w*|initializ\w*|customiz\w*|recogniz\w*"
    r"|optimiz\w*|analyz\w*|favor\w*|honor\w*|catalogs?|center(?:ed|s)?|gray)\b",
    re.IGNORECASE,
)


def text(line):
    """The line without inline code or link targets."""
    return re.sub(r"\]\([^)]*\)", "]", re.sub(r"`[^`]*`", "", line))


errors = []
files = sorted(f for f in root.rglob("*.md") if not skipped & set(f.relative_to(root).parts))
for file in files:
    name = file.relative_to(root).as_posix()
    lines = file.read_text(encoding="utf-8").splitlines()
    if not lines or not re.match(r"^#\s+\S", lines[0]):
        errors.append(f"{name}: must open with an H1 heading")
    # ADR-0010: summary first.
    first = next((line for line in lines[1:] if line.strip()), "")
    if not first.startswith("> **In short:**"):
        errors.append(f"{name}: the first line after the heading must be the In short summary")
    in_fence = False
    for number, line in enumerate(lines, 1):
        if re.match(r"^\s*(?:`{3,}|~{3,})", line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        where = f"{name}:{number}"
        prose = text(line)
        if url.search(prose):
            errors.append(f"{where}: bare URL; external links belong in RESOURCES.md as Markdown links")
        # General documents hold no versions even in code; others may show them in code examples.
        if name not in versioned and version.search(line if name in general else prose):
            errors.append(f"{where}: version number outside CHANGELOG.md, CONTRACT.md and RESOURCES.md")
        for word in american.findall(url.sub("", prose)):
            errors.append(f"{where}: American spelling '{word}'; use British English")
        for match in link.finditer(line):
            href = match.group(1).strip("<>")
            parsed = urlsplit(href)
            if name == "CHANGELOG.md":
                errors.append(f"{where}: CHANGELOG.md holds no links {href}")
                continue
            if parsed.scheme or parsed.netloc:
                if name != "RESOURCES.md":
                    errors.append(f"{where}: external link outside RESOURCES.md {href}")
                    continue
                repository = github.match(href)
                if repository and not pinned.match(repository.group(3) or ""):
                    errors.append(f"{where}: GitHub link not pinned to a commit or tag {href}")
                continue
            if not parsed.path:
                continue
            target = (file.parent / unquote(parsed.path)).resolve()
            if not target.is_relative_to(root) or not target.exists():
                errors.append(f"{where}: broken local link {href}")
if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"Checked {len(files)} Markdown files against the documentation rules")
