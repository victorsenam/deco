import { Section } from "$live/blocks/section.ts";
import { notUndefined } from "$live/engine/core/utils.ts";
import { useLivePageContext } from "$live/pages/LivePage.tsx";
import { WellKnownSlots } from "$live/sections/Slot.tsx";

export interface Props {
  name: string | WellKnownSlots;
  sections: Section[];
}

export default function UseSlot({ sections }: Props) {
  const { renderSection } = useLivePageContext();

  return (
    <>
      {(sections ?? []).filter(notUndefined).map(renderSection)}
    </>
  );
}
