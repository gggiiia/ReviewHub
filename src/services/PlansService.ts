import {proxy} from "valtio/vanilla";
import {useSnapshot} from "valtio/react";

export type Plan = {
  id: string;
  name: string;
  price: number;
  color: string; // hex or css color
}

function uid(prefix = "plan"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

const STORAGE_KEY = "review-hub:plans";

const seedPlans: Plan[] = [
  { id: "free", name: "Free", price: 0, color: "#64748b" },
  { id: "basic", name: "Basic", price: 19, color: "#22c55e" },
  { id: "premium", name: "Premium", price: 49, color: "#a855f7" },
]

function loadPlans(): Plan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedPlans
    const parsed = JSON.parse(raw) as Plan[]
    return Array.isArray(parsed) ? parsed : seedPlans
  } catch {
    return seedPlans
  }
}

function persist(plans: Plan[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  } catch {
    // ignore
  }
}

interface PlansState {
  plans: Plan[];
}

const plansState = proxy<PlansState>({
  plans: loadPlans(),
})

export const plansActions = {
  create(plan: Plan) {
    const id = plan.id ?? uid()
    const newItem: Plan = { ...plan, id }
    plansState.plans = [newItem, ...plansState.plans]
    persist(plansState.plans)
  },
  update(updated: Plan) {
    plansState.plans = plansState.plans.map(p => p.id === updated.id ? updated : p)
    persist(plansState.plans)
  },
  remove(id: string) {
    plansState.plans = plansState.plans.filter(p => p.id !== id)
    persist(plansState.plans)
  }
}

export function usePlans() {
  return useSnapshot(plansState)
}
