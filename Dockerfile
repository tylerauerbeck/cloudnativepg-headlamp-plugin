FROM cgr.dev/chainguard/static:latest

COPY dist/ /plugins/headlamp-cloudnativepg/

USER 1001
