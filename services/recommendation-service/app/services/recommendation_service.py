import json
import re

from pydantic import ValidationError

from app.schemas.response import (
    RecommendationResponse
)

from app.services.dataset_service import (
    get_dataset_by_id
)

from app.services.prompt_builder import (
    build_recommendation_prompt
)

from app.services.gemini_service import (
    generate_recommendation
)


MAX_RETRIES = 3


def extract_json(text: str) -> dict:
    text = text.strip()

    text = re.sub(
        r"^```json\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    return json.loads(text)


def get_recommendation(
    dataset_id: str,
    user_id: str,
    goal: str | None = None,
    target_column: str | None = None
):
    dataset = get_dataset_by_id(
        dataset_id
    )

    if not dataset:
        raise ValueError(
            "Dataset not found"
        )

    if dataset["user_id"] != user_id:
        raise PermissionError(
            "Access denied"
        )

    prompt = build_recommendation_prompt(
        dataset=dataset,
        goal=goal,
        target_column=target_column
    )

    last_error = None

    for attempt in range(MAX_RETRIES):

        response = generate_recommendation(
            prompt
        )

        try:
            parsed_response = extract_json(
                response
            )

            validated_response = (
                RecommendationResponse.model_validate(
                    parsed_response
                )
            )

            return validated_response.model_dump()

        except (
            ValidationError,
            ValueError,
            json.JSONDecodeError,
            KeyError
        ) as e:

            last_error = str(e)

            if attempt == MAX_RETRIES - 1:
                break

            prompt += f"""

IMPORTANT: Your previous response was invalid.

Previous Response:
{response}

Validation Error:
{last_error}

Please regenerate the response.

Rules:
1. Return ONLY valid JSON.
2. Do NOT use markdown.
3. Do NOT wrap the response in ```json.
4. Ensure all enum values exactly match the allowed values.
5. Ensure the response satisfies all schema validation rules.
"""

    raise ValueError(
        f"Failed to generate a valid recommendation after {MAX_RETRIES} attempts. Last error: {last_error}"
    )