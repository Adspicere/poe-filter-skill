# Rate limits for optional FilterBlade features

This policy applies only to optional FilterBlade functionality selected by the user. It adds no dependencies, permissions, runtime checks or pacing requirements to unrelated local-file work. The integration is optional; these limits remain binding when it is used.

These are this skill's conservative limits for agent work, not published FilterBlade service quotas. Apply them across the agent's tools, tabs, endpoints, accounts and delegated work. They do not enable offline testing, authorize asset downloads, or authorize cloud/PoE writes; keep the corresponding permissions in force. A user may request a lower rate. Do not silently relax these limits for speed or change identities/transports to evade them.

Apply the offline reference's [cache-first and 24-hour refresh hold](filterblade-offline.md#prefer-cached-assets-and-hold-refreshes-for-24-hours) before budgeting any cache-related network operation. Available request capacity, a finished cooldown, or general download permission does not override the hold without an explicit user refresh request. Older cache age alone does not require a request.

## Classify by actual traffic

| Class | What belongs here | Minimum start-to-start interval | Rolling maximum |
| --- | --- | --- | --- |
| FilterBlade backend requests | All business/API reads, search, version probes, login/session exchanges and writes, including PoE operations proxied through FilterBlade | 10 seconds | 6 requests in 60 seconds; 60 in 3,600 seconds |
| Backend writes, additional subset limit | Cloud create/edit/delete, PoE synchronization, metadata/account changes, authentication exchange and usage counters | 30 seconds between writes, plus the backend limit above | 2 writes in 60 seconds; 20 in 3,600 seconds |
| Public FilterBlade resource requests | Website documents, JS/libraries, CSV/options/base filters, static module caches, economy data, sounds and other assets; FilterBlade-directed telemetry outside the business API | 2 seconds | 20 requests in 60 seconds; 200 in 3,600 seconds |
| Proven request-free FilterBlade operations | Offline parsing/matching/validation, local cached-data reads, inspected in-memory/UI operations and browser storage changes that make no FilterBlade request | 0.5 seconds | 60 agent operations in 60 seconds; no hourly backend budget |

Keep **at most one FilterBlade-bound network request in flight**, across both network classes. Minimum spacing and both rolling windows all apply; wait until every applicable constraint allows the next dispatch. The write budget is additional: a write consumes both a backend slot and a write slot. A backend route on another host, a proxy, or a different HTTP verb remains backend traffic. Do not distribute requests across endpoints/tabs/workers to multiply a budget.

Each actual outbound request counts, including failures, retries, conditional/304 requests and redirected requests to FilterBlade. One UI click, navigation or tool call is not necessarily one request. Mixed operations must account for every request they cause; their local parts do not convert them into request-free operations. A cache hit qualifies for the local class only when it performs no remote revalidation. Requests from authorized asset acquisition are resource requests until the bytes are cached; subsequent isolated execution uses only the local class.

Examples of backend-bearing operations include uncached My Filters/module lists, server module search, shared-link get/increment, Quick Save, some Download flows, Direct Write and export/sync selectors. A local-sounding label or a method containing `Backend` is insufficient to classify traffic. Use the inspected call chain, current cache state and available network evidence. If business-backend behavior is uncertain, use the backend class until established otherwise. An offline version that attempts a fetch loses its request-free classification; stop that fetch and apply permission and network rules before proceeding.

## Coordinate and enforce before dispatch

- Maintain one request ledger with dispatch times, class, completion/status and cooldown. Carry it across continuations and tool/tab switches; do not reset windows on a retry, new endpoint, error or context compaction. Store it in an approved local evidence location when needed, without tokens, cookies or sensitive request contents. Coordinate delegated work through one dispatcher; without shared coordination, keep network work in one agent.
- Check the ledger before dispatch. Reserve capacity for known fan-out, serialize requests and deduplicate identical/in-flight reads. Prefer existing caches, read one result once, and combine local edits before the final authorized save. Do not repeatedly reload, submit server search on each keystroke, poll account lists or save every local control movement.
- Use a supported request scheduler/control when an operation can emit several requests. A tool that can only trigger an indivisible burst cannot prove compliance with per-request limits. If its fan-out/retries cannot be bounded before dispatch, do not start that automated network operation; report the limitation and continue available local work. Do not claim a timing pause between clicks enforces the request cap. Do not bypass native account/authentication controls with a new HTTP workflow to solve pacing.
- Count agent-initiated, top-level request-free calls/mutations under the higher local limit. An agent-created batch of individual item probes may contain up to 100 cases and counts as one local operation; split larger probe batches into paced calls. A native built-in validation traversal is one operation regardless of its fixed internal sample count. Native iteration, stat comparisons and rows do not each require a delay. Serialize mutations of the same model; independent read-only local work need not wait for a backend slot. Do not expand a batch into an unbounded loop to evade pacing.
- A callback/event or existing in-flight response is preferable to a status request. Any needed remote poll consumes a real backend slot. Request-free DOM/status reads use the local budget. Do not let known page timers, automatic refresh or library retries issue agent-attributable traffic outside the dispatcher; if the available control cannot prevent that, stop starting dependent online actions.

These rules apply to traffic attributable to the agent's actions and the page/runtime it launches or operates. They do not claim control over unrelated user-owned sessions. Without network visibility/control, report instruction-level pacing as a limitation rather than presenting it as a system-wide network firewall.

## Backoff, retries and exhausted budgets

- On HTTP **429** or **503**, stop the current remote sequence. Honor `Retry-After` when present and set a FilterBlade-wide cooldown of at least **15 minutes**, or the server's longer duration. Do not switch endpoints/accounts/proxies or schedule automatic retry loops. Cooldowns restrict FilterBlade-bound traffic, not approved offline/request-free work.
- For other transient network/5xx failures, allow at most **one retry of an idempotent read**, after at least **60 seconds** and only when all budgets and server delays allow. The retry counts as another request. Do not retry ordinary 4xx/authentication failures without resolving their cause.
- Never blindly retry writes after a timeout or ambiguous response. Establish the outcome through existing state or, when needed, one authorized, rate-limited read before deciding whether another write is necessary. A success banner alone does not prove the full asynchronous operation finished.
- When a rolling budget is exhausted, wait until its actual next eligible time or continue local work. Do not reset counters, add background refresh schedules, or keep sending probes to see whether the service has recovered. Report a relevant limit/cooldown and the next eligible time when it affects completion. Use bounded waits that leave room to communicate with the user.

## Evidence

For network work, record the used budget, request counts, errors/retries, cooldown and any enforcement limitation with the task's existing evidence. For fully offline work, identify the isolated cache/runtime and zero FilterBlade-bound requests; report the higher local-operation limit without implying backend quota was consumed. Do not contact FilterBlade merely to test this policy.
