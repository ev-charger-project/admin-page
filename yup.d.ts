// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as yup from "yup";

declare module "yup" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface NumberSchema<TType, TContext, TDefault, TFlags> {
        emptyStringTo(type: null | undefined): this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface StringSchema<TType, TContext, TDefault, TFlags> {
        emptyStringTo(type: null | undefined): this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface BooleanSchema<TType, TContext, TDefault, TFlags> {
        valueToBoolean(): this;
    }
}
