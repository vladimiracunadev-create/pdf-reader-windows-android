# Branch protection · main

Configurar Ruleset para `main`:
- bloquear force-push y borrado;
- requerir PR para cambios normales;
- requerir conversación resuelta;
- requerir checks:
- `Web · tests + landing`
- `Windows · package`
- `Android · APK debug verificado`
- requerir branch actualizada antes de merge cuando sea razonable.

Para un repositorio individual puede mantenerse bypass del propietario para emergencias, registrando el motivo en Issue/CHANGELOG.
