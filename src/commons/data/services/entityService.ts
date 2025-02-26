interface EntitySettings {
  entityLabelKey: string;
  entityIcon: string;
}

const ENTITY_DEFAULTS: EntitySettings = {
  entityLabelKey: 'commons.list-entities-count',
  entityIcon: 'icon-object',
};

export default class EntityService {
  private readonly entityLabelKey: string;
  private readonly entityIcon: string;

  constructor(settings: Partial<EntitySettings> = {}) {
    const mergedSettings: EntitySettings = { ...ENTITY_DEFAULTS, ...settings };

    this.entityLabelKey = mergedSettings.entityLabelKey;
    this.entityIcon = mergedSettings.entityIcon;
  }

  get getEntityLabelKey(): string {
    return this.entityLabelKey;
  }

  get getEntityIcon(): string {
    return this.entityIcon;
  }
}
