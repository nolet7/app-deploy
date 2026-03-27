from pathlib import Path
import json
import yaml

CURRENT_FILE = Path(__file__).resolve()
APP_ROOT = CURRENT_FILE.parents[2]  # /app inside container

CANDIDATE_DIRS = [
    APP_ROOT / "app-templates" / "templates",
    APP_ROOT / "platform-assets" / "app-templates" / "templates",
]

TEMPLATES_DIR = next((p for p in CANDIDATE_DIRS if p.exists()), CANDIDATE_DIRS[0])


def _read_file(file_path: Path):
    if file_path.suffix.lower() in [".yaml", ".yml"]:
        with open(file_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    if file_path.suffix.lower() == ".json":
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def load_all_templates():
    templates = []

    if not TEMPLATES_DIR.exists():
        return templates

    for template_file in sorted(TEMPLATES_DIR.rglob("template.yaml")):
        try:
            data = _read_file(template_file)
            template_dir = template_file.parent

            if not isinstance(data, dict):
                data = {"name": template_dir.name, "raw": data}

            data.setdefault("name", template_dir.name)
            data["source_file"] = str(template_file.relative_to(TEMPLATES_DIR))
            data["template_dir"] = str(template_dir.relative_to(TEMPLATES_DIR))

            files_dir = template_dir / "files"
            data["files_path"] = (
                str(files_dir.relative_to(TEMPLATES_DIR))
                if files_dir.exists()
                else None
            )

            templates.append(data)
        except Exception as e:
            templates.append({
                "name": template_file.parent.name,
                "source_file": str(template_file.relative_to(TEMPLATES_DIR)),
                "error": str(e),
            })

    return templates


def load_template_by_name(name: str):
    for template in load_all_templates():
        if template.get("name") == name:
            return template
    return None
