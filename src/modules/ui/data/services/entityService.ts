interface EntityServiceSettings {
  entityLabelKey?: string;
  entityIcon?: string;
}

const entityDefaults: EntityServiceSettings = {
  entityLabelKey: 'commons.list-entities-count',
  entityIcon: 'icon-object',
};

export default class EntityService {
  private _entityLabelKey: string;
  private _entityIcon: string;

  constructor(settings: EntityServiceSettings = entityDefaults) {
    // Fixed the object assignment to avoid mutating defaults
    const mSettings = Object.assign({}, entityDefaults, settings);

    this._entityLabelKey = mSettings.entityLabelKey!;
    this._entityIcon = mSettings.entityIcon!;
  }

  get entityLabelKey(): string {
    return this._entityLabelKey;
  }

  get entityIcon(): string {
    return this._entityIcon;
  }
}
