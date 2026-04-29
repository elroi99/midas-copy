Here is a concise articulation of what we are trying to build and why
---
I have indian credit card users why want to estimate what is the best card for their set of spends. we are building a tool for them which will take in their spends and calculate how much savings each card in our cards repository will generate

We are designing a deterministic, config-driven credit card reward calculation engine that models real-world credit card reward systems with structural accuracy. The system separates user-facing spend inputs from card-specific reward logic through normalization and optional aggregation layers, allowing fair cross-card comparison while preserving flexibility.

All reward behavior - routing, earn rates, reward pools, spend limits, milestones, and fee waivers - is encoded declaratively in configuration rather than hardcoded into the algorithm. The algorithm itself performs no optimization or decision-making; it strictly executes the logic defined in the config. This ensures transparency, explainability, and maintainability.

The architecture explicitly models key real-world constructs such as shared accelerated pools, depletable spend limits, milestone-eligible spends, and base fallback rewards. It assumes deterministic execution order, fixed reset periods (monthly pools, yearly milestones), and simple rounding rules. It does not currently support tiered earning ladders, rolling windows, cross-category conditional logic, or mid-cycle state persistence.

In essence, we are building a structured abstraction layer over credit card reward systems that enables accurate computation, explainability, cross-card comparison, and future extensibility - while deliberately avoiding runtime combinatorics or heuristic optimization.
