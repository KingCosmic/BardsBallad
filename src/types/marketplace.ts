
export interface MarketplaceItem {
  id: string,
  name: string,
  description: string,

  creator_id: string,
  creator_username: string,

  version: string,

  resource_type: string,
  resource_id: string,

  updated_at: string,
  published_at: string
  is_public: boolean
}

export interface MarketplaceVersion {
  id: string,
  item_id: string,
  changelog: string,
  published_at: string,
  resource_id: string
}