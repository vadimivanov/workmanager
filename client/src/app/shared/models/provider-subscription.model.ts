import { TypeItem } from './dictionary.model';

export class ProviderSubscription extends TypeItem {
  application_fee_percent: number;
  cancel_at_period_end: boolean;
  canceled_at: string;
  created: string;
  current_period_end: string;
  current_period_start: string;
  customer: string;
  discount: string;
  ended_at: string;
  items: Object;
  livemode: boolean;
  metadata: Object;
  plan: {
    amount: number;
    created: number;
    currency: string;
    id: string;
    interval: string;
    interval_count: number;
    livemode: boolean;
    metadata: {};
    name: string;
    object: string;
    statement_descriptor: string;
    trial_period_days: number;
  };
  quantity: number;
  start: number;
  status: string;
  tax_percent: number;
  trial_end: string;
  trial_start: string;

  constructor(obj?: any) {
    super();
    this.id                      = obj && obj.id                      || null;
    this.application_fee_percent = obj && obj.application_fee_percent || null;
    this.cancel_at_period_end    = obj && obj.cancel_at_period_end    || null;
    this.canceled_at             = obj && obj.canceled_at             || null;
    this.created                 = obj && obj.created                 || null;
    this.current_period_end      = obj && obj.current_period_end      || null;
    this.current_period_start    = obj && obj.current_period_start    || null;
    this.customer                = obj && obj.customer                || null;
    this.discount                = obj && obj.discount                || null;
    this.ended_at                = obj && obj.ended_at                || null;
    this.items                   = obj && obj.items                   || null;
    this.livemode                = obj && obj.livemode                || null;
    this.metadata                = obj && obj.metadata                || null;
    this.plan                    = obj && obj.plan                    || null;
    this.quantity                = obj && obj.quantity                || null;
    this.start                   = obj && obj.start                   || null;
    this.status                  = obj && obj.status                  || null;
    this.tax_percent             = obj && obj.tax_percent             || null;
    this.trial_end               = obj && obj.trial_end               || null;
    this.trial_start             = obj && obj.trial_start             || null;
  }
}
