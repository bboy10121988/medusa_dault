import {
  createRegionsWorkflow,
  createStockLocationsWorkflow,
  createSalesChannelsWorkflow,
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * Creates a Taiwan region (TWD), stock location, a dedicated sales channel,
 * links them and generates a publishable api key. Also updates store currencies.
 * Run with: yarn medusa exec ./src/scripts/create-taiwan.ts
 */
export default async function createTaiwanSetup({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Creating Taiwan setup...");

  // 1. Check if Taiwan region exists first
  const regionModuleService = container.resolve(Modules.REGION);
  const existingTaiwanRegions = await regionModuleService.listRegions({
    countries: { iso_2: "tw" }
  });
  
  let region;
  if (existingTaiwanRegions.length > 0) {
    region = existingTaiwanRegions[0];
    logger.info(`Taiwan region already exists (id: ${region.id})`);
  } else {
    const twCode = "tw";
    const regionName = "Taiwan";
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: regionName,
            currency_code: "twd",
            countries: [twCode],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info(`Taiwan region created (id: ${region.id})`);
  }

  // 2. Stock location
  const { result: stockLocations } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Taiwan Warehouse",
          address: {
            country_code: "TW",
            city: "Taipei",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocations[0];

  // 3. Sales channel
  const channelName = "Taiwan Sales Channel";
  const { result: salesChannels } = await createSalesChannelsWorkflow(container).run({
    input: { salesChannelsData: [{ name: channelName }] },
  });
  const salesChannel = salesChannels[0];

  // 4. Publishable API Key (for storefront)
  const { result: apiKeys } = await createApiKeysWorkflow(container).run({
    input: { api_keys: [{ title: "Taiwan Storefront", type: "publishable", created_by: "" }] },
  });
  const publishableKey = apiKeys[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableKey.id, add: [salesChannel.id] },
  });

  logger.info(`Taiwan region: ${region.id}`);
  logger.info(`Taiwan stock location: ${stockLocation.id}`);
  logger.info(`Taiwan sales channel: ${salesChannel.id}`);
  logger.info(`Taiwan publishable API key: ${publishableKey.token}`);
  logger.info("==== COPY THIS API KEY TO .env ====");
  logger.info(`PUBLISHABLE_API_KEY=${publishableKey.token}`);
  logger.info("===================================");
}
