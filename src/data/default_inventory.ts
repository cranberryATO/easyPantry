import { type Inventory } from "@/services/inventory";
import * as Crypto from "expo-crypto";

export const DEFAULT_INVENTORY: Inventory = {
  hasSeeded: true,
  sections: [
    {
      sectionName: "🛖Réserve",
      sectionOrder: 1,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "🚽Papier Toilette (pack de 12)",
          desiredCount: 3,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "⬜Sopalin (pack de 4)",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Mayonnaise",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Moutarde",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 4,
          id: Crypto.randomUUID(),
        },
      ],
    },
    {
      sectionName: "❄️Congélateur",
      sectionOrder: 2,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "Pizza",
          desiredCount: 5,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Glace vanille",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Poulet",
          desiredCount: 3,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Viande hachée",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 4,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Frites",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 5,
          id: Crypto.randomUUID(),
        },
      ],
    },
    {
      sectionName: "🍅Réfrigérateur",
      sectionOrder: 3,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "Salade",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Tomates",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Yaourts",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
      ],
    },
    {
      sectionName: "🥖Placards",
      sectionOrder: 4,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "Chips",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Pâtes",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Riz",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Farine",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 4,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Sucre",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 5,
          id: Crypto.randomUUID(),
        },
      ],
    },
  ],
};
