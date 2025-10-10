import {Page} from "@/components/app/Page.tsx";
import {TypographyH2, TypographyP} from "@/components/ui/Typography.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, BadgeDollarSign} from "lucide-react";
import {plansActions, usePlans} from "@/services/PlansService.ts";
import {PlanCard} from "@/components/app/Plans/PlanCard.tsx";
import {CreatePlanDialog} from "@/components/app/Plans/CreatePlanDialog.tsx";
import IsDesktop from "@/components/ui/isDesktop.tsx";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";

function NoPlansSection() {
  return <Empty className="border">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <BadgeDollarSign className="size-6" />
      </EmptyMedia>
      <EmptyTitle>No plans yet</EmptyTitle>
      <EmptyDescription>
        Create pricing plans that your clients can subscribe to.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
}

function PlansSection() {
  const { plans } = usePlans()
  return <div className="grid gap-3 sm:grid-cols-2">
    {plans.map((p) => (
      <PlanCard
        key={p.id}
        plan={p}
        onEdit={(updated) => plansActions.update(updated)}
        onDelete={(pl) => plansActions.remove(pl.id)}
      />
    ))}
  </div>
}

export function Plans() {
  const { plans } = usePlans()

  return <Page className="p-4 lg:w-1/2 lg:ml-[25%]">
    <div className="flex items-center justify-between gap-2 mb-2">
      <TypographyH2 className="m-0">Plans</TypographyH2>
      <CreatePlanDialog onCreate={(data)=> plansActions.create({ name: data.name, price: data.price, color: data.color })}>
        <Button>
          <Plus className="size-4" />
          <IsDesktop>
            Create plan
          </IsDesktop>
        </Button>
      </CreatePlanDialog>
    </div>
    <TypographyP className="mb-4">Define and manage your pricing plans.</TypographyP>

    {
      plans.length === 0 ?
        <NoPlansSection/> :
        <PlansSection/>
    }
  </Page>
}