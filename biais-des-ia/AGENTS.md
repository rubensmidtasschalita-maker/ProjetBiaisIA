<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- Keep the INSEE citation shared in survey-data and migrate only reference proportions when updating saved survey data, preserving user edits and model results.

- Company/model brand marks must stay inline SVG paths in `src/components/survey/logos.tsx`, rendered through `ModelLogo` (and `ModelAvatar`): raster or imported image assets would not follow the light/dark theme, and one file keeps every mark consistent across selector, avatar, badges and print summary.
