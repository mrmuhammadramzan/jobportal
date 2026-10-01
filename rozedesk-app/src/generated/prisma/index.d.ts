
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model SeekerProfile
 * 
 */
export type SeekerProfile = $Result.DefaultSelection<Prisma.$SeekerProfilePayload>
/**
 * Model Job
 * 
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>
/**
 * Model Application
 * 
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model PaymentSetting
 * 
 */
export type PaymentSetting = $Result.DefaultSelection<Prisma.$PaymentSettingPayload>
/**
 * Model SavedJob
 * 
 */
export type SavedJob = $Result.DefaultSelection<Prisma.$SavedJobPayload>
/**
 * Model Alert
 * 
 */
export type Alert = $Result.DefaultSelection<Prisma.$AlertPayload>
/**
 * Model AnalyticsSummary
 * 
 */
export type AnalyticsSummary = $Result.DefaultSelection<Prisma.$AnalyticsSummaryPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model PlatformSetting
 * 
 */
export type PlatformSetting = $Result.DefaultSelection<Prisma.$PlatformSettingPayload>
/**
 * Model GameWallet
 * 
 */
export type GameWallet = $Result.DefaultSelection<Prisma.$GameWalletPayload>
/**
 * Model GameDeposit
 * 
 */
export type GameDeposit = $Result.DefaultSelection<Prisma.$GameDepositPayload>
/**
 * Model GameSession
 * 
 */
export type GameSession = $Result.DefaultSelection<Prisma.$GameSessionPayload>
/**
 * Model GameWithdrawal
 * 
 */
export type GameWithdrawal = $Result.DefaultSelection<Prisma.$GameWithdrawalPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  SEEKER: 'SEEKER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const JobStatus: {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  DRAFT: 'DRAFT'
};

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus]


export const ApplicationStatus: {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_UNDER_REVIEW: 'PAYMENT_UNDER_REVIEW',
  PAYMENT_REJECTED: 'PAYMENT_REJECTED',
  CV_UNDER_REVIEW: 'CV_UNDER_REVIEW',
  SHORTLISTED: 'SHORTLISTED',
  REJECTED: 'REJECTED',
  HIRED: 'HIRED'
};

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]


export const PaymentStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REFUNDED: 'REFUNDED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const PaymentMethod: {
  JAZZCASH: 'JAZZCASH',
  EASYPAISA: 'EASYPAISA'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const GameDepositStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type GameDepositStatus = (typeof GameDepositStatus)[keyof typeof GameDepositStatus]


export const GameWithdrawalStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type GameWithdrawalStatus = (typeof GameWithdrawalStatus)[keyof typeof GameWithdrawalStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type JobStatus = $Enums.JobStatus

export const JobStatus: typeof $Enums.JobStatus

export type ApplicationStatus = $Enums.ApplicationStatus

export const ApplicationStatus: typeof $Enums.ApplicationStatus

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type GameDepositStatus = $Enums.GameDepositStatus

export const GameDepositStatus: typeof $Enums.GameDepositStatus

export type GameWithdrawalStatus = $Enums.GameWithdrawalStatus

export const GameWithdrawalStatus: typeof $Enums.GameWithdrawalStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.seekerProfile`: Exposes CRUD operations for the **SeekerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeekerProfiles
    * const seekerProfiles = await prisma.seekerProfile.findMany()
    * ```
    */
  get seekerProfile(): Prisma.SeekerProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paymentSetting`: Exposes CRUD operations for the **PaymentSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentSettings
    * const paymentSettings = await prisma.paymentSetting.findMany()
    * ```
    */
  get paymentSetting(): Prisma.PaymentSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.savedJob`: Exposes CRUD operations for the **SavedJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SavedJobs
    * const savedJobs = await prisma.savedJob.findMany()
    * ```
    */
  get savedJob(): Prisma.SavedJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.alert`: Exposes CRUD operations for the **Alert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alerts
    * const alerts = await prisma.alert.findMany()
    * ```
    */
  get alert(): Prisma.AlertDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analyticsSummary`: Exposes CRUD operations for the **AnalyticsSummary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalyticsSummaries
    * const analyticsSummaries = await prisma.analyticsSummary.findMany()
    * ```
    */
  get analyticsSummary(): Prisma.AnalyticsSummaryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.platformSetting`: Exposes CRUD operations for the **PlatformSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlatformSettings
    * const platformSettings = await prisma.platformSetting.findMany()
    * ```
    */
  get platformSetting(): Prisma.PlatformSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameWallet`: Exposes CRUD operations for the **GameWallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameWallets
    * const gameWallets = await prisma.gameWallet.findMany()
    * ```
    */
  get gameWallet(): Prisma.GameWalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameDeposit`: Exposes CRUD operations for the **GameDeposit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameDeposits
    * const gameDeposits = await prisma.gameDeposit.findMany()
    * ```
    */
  get gameDeposit(): Prisma.GameDepositDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameSession`: Exposes CRUD operations for the **GameSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameSessions
    * const gameSessions = await prisma.gameSession.findMany()
    * ```
    */
  get gameSession(): Prisma.GameSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameWithdrawal`: Exposes CRUD operations for the **GameWithdrawal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameWithdrawals
    * const gameWithdrawals = await prisma.gameWithdrawal.findMany()
    * ```
    */
  get gameWithdrawal(): Prisma.GameWithdrawalDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    SeekerProfile: 'SeekerProfile',
    Job: 'Job',
    Application: 'Application',
    Payment: 'Payment',
    PaymentSetting: 'PaymentSetting',
    SavedJob: 'SavedJob',
    Alert: 'Alert',
    AnalyticsSummary: 'AnalyticsSummary',
    Notification: 'Notification',
    PlatformSetting: 'PlatformSetting',
    GameWallet: 'GameWallet',
    GameDeposit: 'GameDeposit',
    GameSession: 'GameSession',
    GameWithdrawal: 'GameWithdrawal'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "seekerProfile" | "job" | "application" | "payment" | "paymentSetting" | "savedJob" | "alert" | "analyticsSummary" | "notification" | "platformSetting" | "gameWallet" | "gameDeposit" | "gameSession" | "gameWithdrawal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      SeekerProfile: {
        payload: Prisma.$SeekerProfilePayload<ExtArgs>
        fields: Prisma.SeekerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeekerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeekerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>
          }
          findFirst: {
            args: Prisma.SeekerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeekerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>
          }
          findMany: {
            args: Prisma.SeekerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>[]
          }
          create: {
            args: Prisma.SeekerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>
          }
          createMany: {
            args: Prisma.SeekerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SeekerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>
          }
          update: {
            args: Prisma.SeekerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>
          }
          deleteMany: {
            args: Prisma.SeekerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeekerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeekerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeekerProfilePayload>
          }
          aggregate: {
            args: Prisma.SeekerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeekerProfile>
          }
          groupBy: {
            args: Prisma.SeekerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeekerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeekerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<SeekerProfileCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      PaymentSetting: {
        payload: Prisma.$PaymentSettingPayload<ExtArgs>
        fields: Prisma.PaymentSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>
          }
          findFirst: {
            args: Prisma.PaymentSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>
          }
          findMany: {
            args: Prisma.PaymentSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>[]
          }
          create: {
            args: Prisma.PaymentSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>
          }
          createMany: {
            args: Prisma.PaymentSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PaymentSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>
          }
          update: {
            args: Prisma.PaymentSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>
          }
          deleteMany: {
            args: Prisma.PaymentSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentSettingPayload>
          }
          aggregate: {
            args: Prisma.PaymentSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentSetting>
          }
          groupBy: {
            args: Prisma.PaymentSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentSettingCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentSettingCountAggregateOutputType> | number
          }
        }
      }
      SavedJob: {
        payload: Prisma.$SavedJobPayload<ExtArgs>
        fields: Prisma.SavedJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SavedJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SavedJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          findFirst: {
            args: Prisma.SavedJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SavedJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          findMany: {
            args: Prisma.SavedJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>[]
          }
          create: {
            args: Prisma.SavedJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          createMany: {
            args: Prisma.SavedJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SavedJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          update: {
            args: Prisma.SavedJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          deleteMany: {
            args: Prisma.SavedJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SavedJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SavedJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedJobPayload>
          }
          aggregate: {
            args: Prisma.SavedJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSavedJob>
          }
          groupBy: {
            args: Prisma.SavedJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<SavedJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.SavedJobCountArgs<ExtArgs>
            result: $Utils.Optional<SavedJobCountAggregateOutputType> | number
          }
        }
      }
      Alert: {
        payload: Prisma.$AlertPayload<ExtArgs>
        fields: Prisma.AlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          findFirst: {
            args: Prisma.AlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          findMany: {
            args: Prisma.AlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>[]
          }
          create: {
            args: Prisma.AlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          createMany: {
            args: Prisma.AlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          update: {
            args: Prisma.AlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          deleteMany: {
            args: Prisma.AlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertPayload>
          }
          aggregate: {
            args: Prisma.AlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlert>
          }
          groupBy: {
            args: Prisma.AlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlertCountArgs<ExtArgs>
            result: $Utils.Optional<AlertCountAggregateOutputType> | number
          }
        }
      }
      AnalyticsSummary: {
        payload: Prisma.$AnalyticsSummaryPayload<ExtArgs>
        fields: Prisma.AnalyticsSummaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalyticsSummaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalyticsSummaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>
          }
          findFirst: {
            args: Prisma.AnalyticsSummaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalyticsSummaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>
          }
          findMany: {
            args: Prisma.AnalyticsSummaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>[]
          }
          create: {
            args: Prisma.AnalyticsSummaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>
          }
          createMany: {
            args: Prisma.AnalyticsSummaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AnalyticsSummaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>
          }
          update: {
            args: Prisma.AnalyticsSummaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>
          }
          deleteMany: {
            args: Prisma.AnalyticsSummaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalyticsSummaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnalyticsSummaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsSummaryPayload>
          }
          aggregate: {
            args: Prisma.AnalyticsSummaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalyticsSummary>
          }
          groupBy: {
            args: Prisma.AnalyticsSummaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsSummaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalyticsSummaryCountArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsSummaryCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      PlatformSetting: {
        payload: Prisma.$PlatformSettingPayload<ExtArgs>
        fields: Prisma.PlatformSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlatformSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlatformSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>
          }
          findFirst: {
            args: Prisma.PlatformSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlatformSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>
          }
          findMany: {
            args: Prisma.PlatformSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>[]
          }
          create: {
            args: Prisma.PlatformSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>
          }
          createMany: {
            args: Prisma.PlatformSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlatformSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>
          }
          update: {
            args: Prisma.PlatformSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>
          }
          deleteMany: {
            args: Prisma.PlatformSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlatformSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlatformSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlatformSettingPayload>
          }
          aggregate: {
            args: Prisma.PlatformSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlatformSetting>
          }
          groupBy: {
            args: Prisma.PlatformSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlatformSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlatformSettingCountArgs<ExtArgs>
            result: $Utils.Optional<PlatformSettingCountAggregateOutputType> | number
          }
        }
      }
      GameWallet: {
        payload: Prisma.$GameWalletPayload<ExtArgs>
        fields: Prisma.GameWalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameWalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameWalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>
          }
          findFirst: {
            args: Prisma.GameWalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameWalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>
          }
          findMany: {
            args: Prisma.GameWalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>[]
          }
          create: {
            args: Prisma.GameWalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>
          }
          createMany: {
            args: Prisma.GameWalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GameWalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>
          }
          update: {
            args: Prisma.GameWalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>
          }
          deleteMany: {
            args: Prisma.GameWalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameWalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GameWalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWalletPayload>
          }
          aggregate: {
            args: Prisma.GameWalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameWallet>
          }
          groupBy: {
            args: Prisma.GameWalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameWalletGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameWalletCountArgs<ExtArgs>
            result: $Utils.Optional<GameWalletCountAggregateOutputType> | number
          }
        }
      }
      GameDeposit: {
        payload: Prisma.$GameDepositPayload<ExtArgs>
        fields: Prisma.GameDepositFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameDepositFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameDepositFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>
          }
          findFirst: {
            args: Prisma.GameDepositFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameDepositFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>
          }
          findMany: {
            args: Prisma.GameDepositFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>[]
          }
          create: {
            args: Prisma.GameDepositCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>
          }
          createMany: {
            args: Prisma.GameDepositCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GameDepositDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>
          }
          update: {
            args: Prisma.GameDepositUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>
          }
          deleteMany: {
            args: Prisma.GameDepositDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameDepositUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GameDepositUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameDepositPayload>
          }
          aggregate: {
            args: Prisma.GameDepositAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameDeposit>
          }
          groupBy: {
            args: Prisma.GameDepositGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameDepositGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameDepositCountArgs<ExtArgs>
            result: $Utils.Optional<GameDepositCountAggregateOutputType> | number
          }
        }
      }
      GameSession: {
        payload: Prisma.$GameSessionPayload<ExtArgs>
        fields: Prisma.GameSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findFirst: {
            args: Prisma.GameSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findMany: {
            args: Prisma.GameSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          create: {
            args: Prisma.GameSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          createMany: {
            args: Prisma.GameSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GameSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          update: {
            args: Prisma.GameSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          deleteMany: {
            args: Prisma.GameSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GameSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          aggregate: {
            args: Prisma.GameSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameSession>
          }
          groupBy: {
            args: Prisma.GameSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameSessionCountArgs<ExtArgs>
            result: $Utils.Optional<GameSessionCountAggregateOutputType> | number
          }
        }
      }
      GameWithdrawal: {
        payload: Prisma.$GameWithdrawalPayload<ExtArgs>
        fields: Prisma.GameWithdrawalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameWithdrawalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameWithdrawalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>
          }
          findFirst: {
            args: Prisma.GameWithdrawalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameWithdrawalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>
          }
          findMany: {
            args: Prisma.GameWithdrawalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>[]
          }
          create: {
            args: Prisma.GameWithdrawalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>
          }
          createMany: {
            args: Prisma.GameWithdrawalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GameWithdrawalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>
          }
          update: {
            args: Prisma.GameWithdrawalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>
          }
          deleteMany: {
            args: Prisma.GameWithdrawalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameWithdrawalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GameWithdrawalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameWithdrawalPayload>
          }
          aggregate: {
            args: Prisma.GameWithdrawalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameWithdrawal>
          }
          groupBy: {
            args: Prisma.GameWithdrawalGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameWithdrawalGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameWithdrawalCountArgs<ExtArgs>
            result: $Utils.Optional<GameWithdrawalCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    seekerProfile?: SeekerProfileOmit
    job?: JobOmit
    application?: ApplicationOmit
    payment?: PaymentOmit
    paymentSetting?: PaymentSettingOmit
    savedJob?: SavedJobOmit
    alert?: AlertOmit
    analyticsSummary?: AnalyticsSummaryOmit
    notification?: NotificationOmit
    platformSetting?: PlatformSettingOmit
    gameWallet?: GameWalletOmit
    gameDeposit?: GameDepositOmit
    gameSession?: GameSessionOmit
    gameWithdrawal?: GameWithdrawalOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    applications: number
    savedJobs: number
    alerts: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | UserCountOutputTypeCountApplicationsArgs
    savedJobs?: boolean | UserCountOutputTypeCountSavedJobsArgs
    alerts?: boolean | UserCountOutputTypeCountAlertsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedJobWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type JobCountOutputType
   */

  export type JobCountOutputType = {
    applications: number
    savedBy: number
  }

  export type JobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | JobCountOutputTypeCountApplicationsArgs
    savedBy?: boolean | JobCountOutputTypeCountSavedByArgs
  }

  // Custom InputTypes
  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobCountOutputType
     */
    select?: JobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountSavedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedJobWhereInput
  }


  /**
   * Count Type GameWalletCountOutputType
   */

  export type GameWalletCountOutputType = {
    deposits: number
    sessions: number
    withdrawals: number
  }

  export type GameWalletCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposits?: boolean | GameWalletCountOutputTypeCountDepositsArgs
    sessions?: boolean | GameWalletCountOutputTypeCountSessionsArgs
    withdrawals?: boolean | GameWalletCountOutputTypeCountWithdrawalsArgs
  }

  // Custom InputTypes
  /**
   * GameWalletCountOutputType without action
   */
  export type GameWalletCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWalletCountOutputType
     */
    select?: GameWalletCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameWalletCountOutputType without action
   */
  export type GameWalletCountOutputTypeCountDepositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameDepositWhereInput
  }

  /**
   * GameWalletCountOutputType without action
   */
  export type GameWalletCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionWhereInput
  }

  /**
   * GameWalletCountOutputType without action
   */
  export type GameWalletCountOutputTypeCountWithdrawalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWithdrawalWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
    blocked: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    resetToken: string | null
    resetTokenExpiry: Date | null
    blocked: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    passwordHash: number
    role: number
    createdAt: number
    updatedAt: number
    resetToken: number
    resetTokenExpiry: number
    blocked: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiry?: true
    blocked?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiry?: true
    blocked?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiry?: true
    blocked?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string | null
    passwordHash: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    resetToken: string | null
    resetTokenExpiry: Date | null
    blocked: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
    blocked?: boolean
    profile?: boolean | User$profileArgs<ExtArgs>
    applications?: boolean | User$applicationsArgs<ExtArgs>
    savedJobs?: boolean | User$savedJobsArgs<ExtArgs>
    alerts?: boolean | User$alertsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    gameWallet?: boolean | User$gameWalletArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
    blocked?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phone" | "passwordHash" | "role" | "createdAt" | "updatedAt" | "resetToken" | "resetTokenExpiry" | "blocked", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | User$profileArgs<ExtArgs>
    applications?: boolean | User$applicationsArgs<ExtArgs>
    savedJobs?: boolean | User$savedJobsArgs<ExtArgs>
    alerts?: boolean | User$alertsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    gameWallet?: boolean | User$gameWalletArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      profile: Prisma.$SeekerProfilePayload<ExtArgs> | null
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      savedJobs: Prisma.$SavedJobPayload<ExtArgs>[]
      alerts: Prisma.$AlertPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      gameWallet: Prisma.$GameWalletPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string | null
      passwordHash: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
      resetToken: string | null
      resetTokenExpiry: Date | null
      blocked: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends User$profileArgs<ExtArgs> = {}>(args?: Subset<T, User$profileArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    applications<T extends User$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    savedJobs<T extends User$savedJobsArgs<ExtArgs> = {}>(args?: Subset<T, User$savedJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    alerts<T extends User$alertsArgs<ExtArgs> = {}>(args?: Subset<T, User$alertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gameWallet<T extends User$gameWalletArgs<ExtArgs> = {}>(args?: Subset<T, User$gameWalletArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly resetToken: FieldRef<"User", 'String'>
    readonly resetTokenExpiry: FieldRef<"User", 'DateTime'>
    readonly blocked: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.profile
   */
  export type User$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    where?: SeekerProfileWhereInput
  }

  /**
   * User.applications
   */
  export type User$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * User.savedJobs
   */
  export type User$savedJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    where?: SavedJobWhereInput
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    cursor?: SavedJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * User.alerts
   */
  export type User$alertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    where?: AlertWhereInput
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    cursor?: AlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.gameWallet
   */
  export type User$gameWalletArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    where?: GameWalletWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model SeekerProfile
   */

  export type AggregateSeekerProfile = {
    _count: SeekerProfileCountAggregateOutputType | null
    _min: SeekerProfileMinAggregateOutputType | null
    _max: SeekerProfileMaxAggregateOutputType | null
  }

  export type SeekerProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    phone: string | null
    location: string | null
    summary: string | null
    linkedin: string | null
    github: string | null
    portfolio: string | null
    currentProject: string | null
    jobType: string | null
    desiredSalary: string | null
    remotePref: string | null
    cvUrl: string | null
    updatedAt: Date | null
  }

  export type SeekerProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    phone: string | null
    location: string | null
    summary: string | null
    linkedin: string | null
    github: string | null
    portfolio: string | null
    currentProject: string | null
    jobType: string | null
    desiredSalary: string | null
    remotePref: string | null
    cvUrl: string | null
    updatedAt: Date | null
  }

  export type SeekerProfileCountAggregateOutputType = {
    id: number
    userId: number
    phone: number
    location: number
    summary: number
    skills: number
    linkedin: number
    github: number
    portfolio: number
    education: number
    experience: number
    currentProject: number
    jobType: number
    desiredSalary: number
    remotePref: number
    cvUrl: number
    updatedAt: number
    _all: number
  }


  export type SeekerProfileMinAggregateInputType = {
    id?: true
    userId?: true
    phone?: true
    location?: true
    summary?: true
    linkedin?: true
    github?: true
    portfolio?: true
    currentProject?: true
    jobType?: true
    desiredSalary?: true
    remotePref?: true
    cvUrl?: true
    updatedAt?: true
  }

  export type SeekerProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    phone?: true
    location?: true
    summary?: true
    linkedin?: true
    github?: true
    portfolio?: true
    currentProject?: true
    jobType?: true
    desiredSalary?: true
    remotePref?: true
    cvUrl?: true
    updatedAt?: true
  }

  export type SeekerProfileCountAggregateInputType = {
    id?: true
    userId?: true
    phone?: true
    location?: true
    summary?: true
    skills?: true
    linkedin?: true
    github?: true
    portfolio?: true
    education?: true
    experience?: true
    currentProject?: true
    jobType?: true
    desiredSalary?: true
    remotePref?: true
    cvUrl?: true
    updatedAt?: true
    _all?: true
  }

  export type SeekerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeekerProfile to aggregate.
     */
    where?: SeekerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeekerProfiles to fetch.
     */
    orderBy?: SeekerProfileOrderByWithRelationInput | SeekerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeekerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeekerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeekerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeekerProfiles
    **/
    _count?: true | SeekerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeekerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeekerProfileMaxAggregateInputType
  }

  export type GetSeekerProfileAggregateType<T extends SeekerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateSeekerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeekerProfile[P]>
      : GetScalarType<T[P], AggregateSeekerProfile[P]>
  }




  export type SeekerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeekerProfileWhereInput
    orderBy?: SeekerProfileOrderByWithAggregationInput | SeekerProfileOrderByWithAggregationInput[]
    by: SeekerProfileScalarFieldEnum[] | SeekerProfileScalarFieldEnum
    having?: SeekerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeekerProfileCountAggregateInputType | true
    _min?: SeekerProfileMinAggregateInputType
    _max?: SeekerProfileMaxAggregateInputType
  }

  export type SeekerProfileGroupByOutputType = {
    id: string
    userId: string
    phone: string | null
    location: string | null
    summary: string | null
    skills: JsonValue
    linkedin: string | null
    github: string | null
    portfolio: string | null
    education: JsonValue
    experience: JsonValue
    currentProject: string | null
    jobType: string | null
    desiredSalary: string | null
    remotePref: string | null
    cvUrl: string | null
    updatedAt: Date
    _count: SeekerProfileCountAggregateOutputType | null
    _min: SeekerProfileMinAggregateOutputType | null
    _max: SeekerProfileMaxAggregateOutputType | null
  }

  type GetSeekerProfileGroupByPayload<T extends SeekerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeekerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeekerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeekerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], SeekerProfileGroupByOutputType[P]>
        }
      >
    >


  export type SeekerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    phone?: boolean
    location?: boolean
    summary?: boolean
    skills?: boolean
    linkedin?: boolean
    github?: boolean
    portfolio?: boolean
    education?: boolean
    experience?: boolean
    currentProject?: boolean
    jobType?: boolean
    desiredSalary?: boolean
    remotePref?: boolean
    cvUrl?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["seekerProfile"]>



  export type SeekerProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    phone?: boolean
    location?: boolean
    summary?: boolean
    skills?: boolean
    linkedin?: boolean
    github?: boolean
    portfolio?: boolean
    education?: boolean
    experience?: boolean
    currentProject?: boolean
    jobType?: boolean
    desiredSalary?: boolean
    remotePref?: boolean
    cvUrl?: boolean
    updatedAt?: boolean
  }

  export type SeekerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "phone" | "location" | "summary" | "skills" | "linkedin" | "github" | "portfolio" | "education" | "experience" | "currentProject" | "jobType" | "desiredSalary" | "remotePref" | "cvUrl" | "updatedAt", ExtArgs["result"]["seekerProfile"]>
  export type SeekerProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SeekerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeekerProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      phone: string | null
      location: string | null
      summary: string | null
      skills: Prisma.JsonValue
      linkedin: string | null
      github: string | null
      portfolio: string | null
      education: Prisma.JsonValue
      experience: Prisma.JsonValue
      currentProject: string | null
      jobType: string | null
      desiredSalary: string | null
      remotePref: string | null
      cvUrl: string | null
      updatedAt: Date
    }, ExtArgs["result"]["seekerProfile"]>
    composites: {}
  }

  type SeekerProfileGetPayload<S extends boolean | null | undefined | SeekerProfileDefaultArgs> = $Result.GetResult<Prisma.$SeekerProfilePayload, S>

  type SeekerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeekerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeekerProfileCountAggregateInputType | true
    }

  export interface SeekerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeekerProfile'], meta: { name: 'SeekerProfile' } }
    /**
     * Find zero or one SeekerProfile that matches the filter.
     * @param {SeekerProfileFindUniqueArgs} args - Arguments to find a SeekerProfile
     * @example
     * // Get one SeekerProfile
     * const seekerProfile = await prisma.seekerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeekerProfileFindUniqueArgs>(args: SelectSubset<T, SeekerProfileFindUniqueArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SeekerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeekerProfileFindUniqueOrThrowArgs} args - Arguments to find a SeekerProfile
     * @example
     * // Get one SeekerProfile
     * const seekerProfile = await prisma.seekerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeekerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, SeekerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeekerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileFindFirstArgs} args - Arguments to find a SeekerProfile
     * @example
     * // Get one SeekerProfile
     * const seekerProfile = await prisma.seekerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeekerProfileFindFirstArgs>(args?: SelectSubset<T, SeekerProfileFindFirstArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SeekerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileFindFirstOrThrowArgs} args - Arguments to find a SeekerProfile
     * @example
     * // Get one SeekerProfile
     * const seekerProfile = await prisma.seekerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeekerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, SeekerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SeekerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeekerProfiles
     * const seekerProfiles = await prisma.seekerProfile.findMany()
     * 
     * // Get first 10 SeekerProfiles
     * const seekerProfiles = await prisma.seekerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seekerProfileWithIdOnly = await prisma.seekerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeekerProfileFindManyArgs>(args?: SelectSubset<T, SeekerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SeekerProfile.
     * @param {SeekerProfileCreateArgs} args - Arguments to create a SeekerProfile.
     * @example
     * // Create one SeekerProfile
     * const SeekerProfile = await prisma.seekerProfile.create({
     *   data: {
     *     // ... data to create a SeekerProfile
     *   }
     * })
     * 
     */
    create<T extends SeekerProfileCreateArgs>(args: SelectSubset<T, SeekerProfileCreateArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SeekerProfiles.
     * @param {SeekerProfileCreateManyArgs} args - Arguments to create many SeekerProfiles.
     * @example
     * // Create many SeekerProfiles
     * const seekerProfile = await prisma.seekerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeekerProfileCreateManyArgs>(args?: SelectSubset<T, SeekerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SeekerProfile.
     * @param {SeekerProfileDeleteArgs} args - Arguments to delete one SeekerProfile.
     * @example
     * // Delete one SeekerProfile
     * const SeekerProfile = await prisma.seekerProfile.delete({
     *   where: {
     *     // ... filter to delete one SeekerProfile
     *   }
     * })
     * 
     */
    delete<T extends SeekerProfileDeleteArgs>(args: SelectSubset<T, SeekerProfileDeleteArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SeekerProfile.
     * @param {SeekerProfileUpdateArgs} args - Arguments to update one SeekerProfile.
     * @example
     * // Update one SeekerProfile
     * const seekerProfile = await prisma.seekerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeekerProfileUpdateArgs>(args: SelectSubset<T, SeekerProfileUpdateArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SeekerProfiles.
     * @param {SeekerProfileDeleteManyArgs} args - Arguments to filter SeekerProfiles to delete.
     * @example
     * // Delete a few SeekerProfiles
     * const { count } = await prisma.seekerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeekerProfileDeleteManyArgs>(args?: SelectSubset<T, SeekerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeekerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeekerProfiles
     * const seekerProfile = await prisma.seekerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeekerProfileUpdateManyArgs>(args: SelectSubset<T, SeekerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeekerProfile.
     * @param {SeekerProfileUpsertArgs} args - Arguments to update or create a SeekerProfile.
     * @example
     * // Update or create a SeekerProfile
     * const seekerProfile = await prisma.seekerProfile.upsert({
     *   create: {
     *     // ... data to create a SeekerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeekerProfile we want to update
     *   }
     * })
     */
    upsert<T extends SeekerProfileUpsertArgs>(args: SelectSubset<T, SeekerProfileUpsertArgs<ExtArgs>>): Prisma__SeekerProfileClient<$Result.GetResult<Prisma.$SeekerProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SeekerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileCountArgs} args - Arguments to filter SeekerProfiles to count.
     * @example
     * // Count the number of SeekerProfiles
     * const count = await prisma.seekerProfile.count({
     *   where: {
     *     // ... the filter for the SeekerProfiles we want to count
     *   }
     * })
    **/
    count<T extends SeekerProfileCountArgs>(
      args?: Subset<T, SeekerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeekerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeekerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeekerProfileAggregateArgs>(args: Subset<T, SeekerProfileAggregateArgs>): Prisma.PrismaPromise<GetSeekerProfileAggregateType<T>>

    /**
     * Group by SeekerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeekerProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeekerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeekerProfileGroupByArgs['orderBy'] }
        : { orderBy?: SeekerProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeekerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeekerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeekerProfile model
   */
  readonly fields: SeekerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeekerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeekerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeekerProfile model
   */
  interface SeekerProfileFieldRefs {
    readonly id: FieldRef<"SeekerProfile", 'String'>
    readonly userId: FieldRef<"SeekerProfile", 'String'>
    readonly phone: FieldRef<"SeekerProfile", 'String'>
    readonly location: FieldRef<"SeekerProfile", 'String'>
    readonly summary: FieldRef<"SeekerProfile", 'String'>
    readonly skills: FieldRef<"SeekerProfile", 'Json'>
    readonly linkedin: FieldRef<"SeekerProfile", 'String'>
    readonly github: FieldRef<"SeekerProfile", 'String'>
    readonly portfolio: FieldRef<"SeekerProfile", 'String'>
    readonly education: FieldRef<"SeekerProfile", 'Json'>
    readonly experience: FieldRef<"SeekerProfile", 'Json'>
    readonly currentProject: FieldRef<"SeekerProfile", 'String'>
    readonly jobType: FieldRef<"SeekerProfile", 'String'>
    readonly desiredSalary: FieldRef<"SeekerProfile", 'String'>
    readonly remotePref: FieldRef<"SeekerProfile", 'String'>
    readonly cvUrl: FieldRef<"SeekerProfile", 'String'>
    readonly updatedAt: FieldRef<"SeekerProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeekerProfile findUnique
   */
  export type SeekerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * Filter, which SeekerProfile to fetch.
     */
    where: SeekerProfileWhereUniqueInput
  }

  /**
   * SeekerProfile findUniqueOrThrow
   */
  export type SeekerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * Filter, which SeekerProfile to fetch.
     */
    where: SeekerProfileWhereUniqueInput
  }

  /**
   * SeekerProfile findFirst
   */
  export type SeekerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * Filter, which SeekerProfile to fetch.
     */
    where?: SeekerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeekerProfiles to fetch.
     */
    orderBy?: SeekerProfileOrderByWithRelationInput | SeekerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeekerProfiles.
     */
    cursor?: SeekerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeekerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeekerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeekerProfiles.
     */
    distinct?: SeekerProfileScalarFieldEnum | SeekerProfileScalarFieldEnum[]
  }

  /**
   * SeekerProfile findFirstOrThrow
   */
  export type SeekerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * Filter, which SeekerProfile to fetch.
     */
    where?: SeekerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeekerProfiles to fetch.
     */
    orderBy?: SeekerProfileOrderByWithRelationInput | SeekerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeekerProfiles.
     */
    cursor?: SeekerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeekerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeekerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeekerProfiles.
     */
    distinct?: SeekerProfileScalarFieldEnum | SeekerProfileScalarFieldEnum[]
  }

  /**
   * SeekerProfile findMany
   */
  export type SeekerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * Filter, which SeekerProfiles to fetch.
     */
    where?: SeekerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeekerProfiles to fetch.
     */
    orderBy?: SeekerProfileOrderByWithRelationInput | SeekerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeekerProfiles.
     */
    cursor?: SeekerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeekerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeekerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeekerProfiles.
     */
    distinct?: SeekerProfileScalarFieldEnum | SeekerProfileScalarFieldEnum[]
  }

  /**
   * SeekerProfile create
   */
  export type SeekerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a SeekerProfile.
     */
    data: XOR<SeekerProfileCreateInput, SeekerProfileUncheckedCreateInput>
  }

  /**
   * SeekerProfile createMany
   */
  export type SeekerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeekerProfiles.
     */
    data: SeekerProfileCreateManyInput | SeekerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeekerProfile update
   */
  export type SeekerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a SeekerProfile.
     */
    data: XOR<SeekerProfileUpdateInput, SeekerProfileUncheckedUpdateInput>
    /**
     * Choose, which SeekerProfile to update.
     */
    where: SeekerProfileWhereUniqueInput
  }

  /**
   * SeekerProfile updateMany
   */
  export type SeekerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeekerProfiles.
     */
    data: XOR<SeekerProfileUpdateManyMutationInput, SeekerProfileUncheckedUpdateManyInput>
    /**
     * Filter which SeekerProfiles to update
     */
    where?: SeekerProfileWhereInput
    /**
     * Limit how many SeekerProfiles to update.
     */
    limit?: number
  }

  /**
   * SeekerProfile upsert
   */
  export type SeekerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the SeekerProfile to update in case it exists.
     */
    where: SeekerProfileWhereUniqueInput
    /**
     * In case the SeekerProfile found by the `where` argument doesn't exist, create a new SeekerProfile with this data.
     */
    create: XOR<SeekerProfileCreateInput, SeekerProfileUncheckedCreateInput>
    /**
     * In case the SeekerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeekerProfileUpdateInput, SeekerProfileUncheckedUpdateInput>
  }

  /**
   * SeekerProfile delete
   */
  export type SeekerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
    /**
     * Filter which SeekerProfile to delete.
     */
    where: SeekerProfileWhereUniqueInput
  }

  /**
   * SeekerProfile deleteMany
   */
  export type SeekerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeekerProfiles to delete
     */
    where?: SeekerProfileWhereInput
    /**
     * Limit how many SeekerProfiles to delete.
     */
    limit?: number
  }

  /**
   * SeekerProfile without action
   */
  export type SeekerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeekerProfile
     */
    select?: SeekerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SeekerProfile
     */
    omit?: SeekerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeekerProfileInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobAvgAggregateOutputType = {
    salaryMin: number | null
    salaryMax: number | null
  }

  export type JobSumAggregateOutputType = {
    salaryMin: number | null
    salaryMax: number | null
  }

  export type JobMinAggregateOutputType = {
    id: string | null
    title: string | null
    company: string | null
    location: string | null
    type: string | null
    category: string | null
    description: string | null
    salaryMin: number | null
    salaryMax: number | null
    deadline: Date | null
    status: $Enums.JobStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobMaxAggregateOutputType = {
    id: string | null
    title: string | null
    company: string | null
    location: string | null
    type: string | null
    category: string | null
    description: string | null
    salaryMin: number | null
    salaryMax: number | null
    deadline: Date | null
    status: $Enums.JobStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobCountAggregateOutputType = {
    id: number
    title: number
    company: number
    location: number
    type: number
    category: number
    description: number
    requirements: number
    benefits: number
    salaryMin: number
    salaryMax: number
    deadline: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JobAvgAggregateInputType = {
    salaryMin?: true
    salaryMax?: true
  }

  export type JobSumAggregateInputType = {
    salaryMin?: true
    salaryMax?: true
  }

  export type JobMinAggregateInputType = {
    id?: true
    title?: true
    company?: true
    location?: true
    type?: true
    category?: true
    description?: true
    salaryMin?: true
    salaryMax?: true
    deadline?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobMaxAggregateInputType = {
    id?: true
    title?: true
    company?: true
    location?: true
    type?: true
    category?: true
    description?: true
    salaryMin?: true
    salaryMax?: true
    deadline?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobCountAggregateInputType = {
    id?: true
    title?: true
    company?: true
    location?: true
    type?: true
    category?: true
    description?: true
    requirements?: true
    benefits?: true
    salaryMin?: true
    salaryMax?: true
    deadline?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _avg?: JobAvgAggregateInputType
    _sum?: JobSumAggregateInputType
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    id: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements: JsonValue
    benefits: JsonValue
    salaryMin: number | null
    salaryMax: number | null
    deadline: Date | null
    status: $Enums.JobStatus
    createdAt: Date
    updatedAt: Date
    _count: JobCountAggregateOutputType | null
    _avg: JobAvgAggregateOutputType | null
    _sum: JobSumAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    type?: boolean
    category?: boolean
    description?: boolean
    requirements?: boolean
    benefits?: boolean
    salaryMin?: boolean
    salaryMax?: boolean
    deadline?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    applications?: boolean | Job$applicationsArgs<ExtArgs>
    savedBy?: boolean | Job$savedByArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>



  export type JobSelectScalar = {
    id?: boolean
    title?: boolean
    company?: boolean
    location?: boolean
    type?: boolean
    category?: boolean
    description?: boolean
    requirements?: boolean
    benefits?: boolean
    salaryMin?: boolean
    salaryMax?: boolean
    deadline?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "company" | "location" | "type" | "category" | "description" | "requirements" | "benefits" | "salaryMin" | "salaryMax" | "deadline" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["job"]>
  export type JobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | Job$applicationsArgs<ExtArgs>
    savedBy?: boolean | Job$savedByArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      savedBy: Prisma.$SavedJobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      company: string
      location: string
      type: string
      category: string
      description: string
      requirements: Prisma.JsonValue
      benefits: Prisma.JsonValue
      salaryMin: number | null
      salaryMax: number | null
      deadline: Date | null
      status: $Enums.JobStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobWithIdOnly = await prisma.job.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends Job$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Job$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    savedBy<T extends Job$savedByArgs<ExtArgs> = {}>(args?: Subset<T, Job$savedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Job model
   */
  interface JobFieldRefs {
    readonly id: FieldRef<"Job", 'String'>
    readonly title: FieldRef<"Job", 'String'>
    readonly company: FieldRef<"Job", 'String'>
    readonly location: FieldRef<"Job", 'String'>
    readonly type: FieldRef<"Job", 'String'>
    readonly category: FieldRef<"Job", 'String'>
    readonly description: FieldRef<"Job", 'String'>
    readonly requirements: FieldRef<"Job", 'Json'>
    readonly benefits: FieldRef<"Job", 'Json'>
    readonly salaryMin: FieldRef<"Job", 'Int'>
    readonly salaryMax: FieldRef<"Job", 'Int'>
    readonly deadline: FieldRef<"Job", 'DateTime'>
    readonly status: FieldRef<"Job", 'JobStatus'>
    readonly createdAt: FieldRef<"Job", 'DateTime'>
    readonly updatedAt: FieldRef<"Job", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to update.
     */
    limit?: number
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
    /**
     * Limit how many Jobs to delete.
     */
    limit?: number
  }

  /**
   * Job.applications
   */
  export type Job$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Job.savedBy
   */
  export type Job$savedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    where?: SavedJobWhereInput
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    cursor?: SavedJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Job
     */
    omit?: JobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
  }


  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    cvUrl: string | null
    status: $Enums.ApplicationStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    cvUrl: string | null
    status: $Enums.ApplicationStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    userId: number
    jobId: number
    cvUrl: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ApplicationMinAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    cvUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    cvUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    cvUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: string
    userId: string
    jobId: string
    cvUrl: string
    status: $Enums.ApplicationStatus
    createdAt: Date
    updatedAt: Date
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    cvUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
    payment?: boolean | Application$paymentArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>



  export type ApplicationSelectScalar = {
    id?: boolean
    userId?: boolean
    jobId?: boolean
    cvUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobId" | "cvUrl" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["application"]>
  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
    payment?: boolean | Application$paymentArgs<ExtArgs>
  }

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs>
      payment: Prisma.$PaymentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobId: string
      cvUrl: string
      status: $Enums.ApplicationStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payment<T extends Application$paymentArgs<ExtArgs> = {}>(args?: Subset<T, Application$paymentArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Application model
   */
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'String'>
    readonly userId: FieldRef<"Application", 'String'>
    readonly jobId: FieldRef<"Application", 'String'>
    readonly cvUrl: FieldRef<"Application", 'String'>
    readonly status: FieldRef<"Application", 'ApplicationStatus'>
    readonly createdAt: FieldRef<"Application", 'DateTime'>
    readonly updatedAt: FieldRef<"Application", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to delete.
     */
    limit?: number
  }

  /**
   * Application.payment
   */
  export type Application$paymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    applicationId: string | null
    amount: number | null
    method: $Enums.PaymentMethod | null
    receiptUrl: string | null
    receiptRef: string | null
    status: $Enums.PaymentStatus | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    applicationId: string | null
    amount: number | null
    method: $Enums.PaymentMethod | null
    receiptUrl: string | null
    receiptRef: string | null
    status: $Enums.PaymentStatus | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    applicationId: number
    amount: number
    method: number
    receiptUrl: number
    receiptRef: number
    status: number
    rejectionReason: number
    submittedAt: number
    reviewedAt: number
    reviewedBy: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    applicationId?: true
    amount?: true
    method?: true
    receiptUrl?: true
    receiptRef?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    applicationId?: true
    amount?: true
    method?: true
    receiptUrl?: true
    receiptRef?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    applicationId?: true
    amount?: true
    method?: true
    receiptUrl?: true
    receiptRef?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    applicationId: string
    amount: number
    method: $Enums.PaymentMethod
    receiptUrl: string
    receiptRef: string | null
    status: $Enums.PaymentStatus
    rejectionReason: string | null
    submittedAt: Date
    reviewedAt: Date | null
    reviewedBy: string | null
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationId?: boolean
    amount?: boolean
    method?: boolean
    receiptUrl?: boolean
    receiptRef?: boolean
    status?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>



  export type PaymentSelectScalar = {
    id?: boolean
    applicationId?: boolean
    amount?: boolean
    method?: boolean
    receiptUrl?: boolean
    receiptRef?: boolean
    status?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "applicationId" | "amount" | "method" | "receiptUrl" | "receiptRef" | "status" | "rejectionReason" | "submittedAt" | "reviewedAt" | "reviewedBy", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | ApplicationDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      application: Prisma.$ApplicationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      applicationId: string
      amount: number
      method: $Enums.PaymentMethod
      receiptUrl: string
      receiptRef: string | null
      status: $Enums.PaymentStatus
      rejectionReason: string | null
      submittedAt: Date
      reviewedAt: Date | null
      reviewedBy: string | null
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    application<T extends ApplicationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ApplicationDefaultArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly applicationId: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Int'>
    readonly method: FieldRef<"Payment", 'PaymentMethod'>
    readonly receiptUrl: FieldRef<"Payment", 'String'>
    readonly receiptRef: FieldRef<"Payment", 'String'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly rejectionReason: FieldRef<"Payment", 'String'>
    readonly submittedAt: FieldRef<"Payment", 'DateTime'>
    readonly reviewedAt: FieldRef<"Payment", 'DateTime'>
    readonly reviewedBy: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model PaymentSetting
   */

  export type AggregatePaymentSetting = {
    _count: PaymentSettingCountAggregateOutputType | null
    _min: PaymentSettingMinAggregateOutputType | null
    _max: PaymentSettingMaxAggregateOutputType | null
  }

  export type PaymentSettingMinAggregateOutputType = {
    id: string | null
    method: string | null
    phone: string | null
    name: string | null
    address: string | null
    active: boolean | null
    updatedAt: Date | null
  }

  export type PaymentSettingMaxAggregateOutputType = {
    id: string | null
    method: string | null
    phone: string | null
    name: string | null
    address: string | null
    active: boolean | null
    updatedAt: Date | null
  }

  export type PaymentSettingCountAggregateOutputType = {
    id: number
    method: number
    phone: number
    name: number
    address: number
    active: number
    updatedAt: number
    _all: number
  }


  export type PaymentSettingMinAggregateInputType = {
    id?: true
    method?: true
    phone?: true
    name?: true
    address?: true
    active?: true
    updatedAt?: true
  }

  export type PaymentSettingMaxAggregateInputType = {
    id?: true
    method?: true
    phone?: true
    name?: true
    address?: true
    active?: true
    updatedAt?: true
  }

  export type PaymentSettingCountAggregateInputType = {
    id?: true
    method?: true
    phone?: true
    name?: true
    address?: true
    active?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentSetting to aggregate.
     */
    where?: PaymentSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentSettings to fetch.
     */
    orderBy?: PaymentSettingOrderByWithRelationInput | PaymentSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentSettings
    **/
    _count?: true | PaymentSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentSettingMaxAggregateInputType
  }

  export type GetPaymentSettingAggregateType<T extends PaymentSettingAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentSetting[P]>
      : GetScalarType<T[P], AggregatePaymentSetting[P]>
  }




  export type PaymentSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentSettingWhereInput
    orderBy?: PaymentSettingOrderByWithAggregationInput | PaymentSettingOrderByWithAggregationInput[]
    by: PaymentSettingScalarFieldEnum[] | PaymentSettingScalarFieldEnum
    having?: PaymentSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentSettingCountAggregateInputType | true
    _min?: PaymentSettingMinAggregateInputType
    _max?: PaymentSettingMaxAggregateInputType
  }

  export type PaymentSettingGroupByOutputType = {
    id: string
    method: string
    phone: string
    name: string
    address: string | null
    active: boolean
    updatedAt: Date
    _count: PaymentSettingCountAggregateOutputType | null
    _min: PaymentSettingMinAggregateOutputType | null
    _max: PaymentSettingMaxAggregateOutputType | null
  }

  type GetPaymentSettingGroupByPayload<T extends PaymentSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentSettingGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentSettingGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    method?: boolean
    phone?: boolean
    name?: boolean
    address?: boolean
    active?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["paymentSetting"]>



  export type PaymentSettingSelectScalar = {
    id?: boolean
    method?: boolean
    phone?: boolean
    name?: boolean
    address?: boolean
    active?: boolean
    updatedAt?: boolean
  }

  export type PaymentSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "method" | "phone" | "name" | "address" | "active" | "updatedAt", ExtArgs["result"]["paymentSetting"]>

  export type $PaymentSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      method: string
      phone: string
      name: string
      address: string | null
      active: boolean
      updatedAt: Date
    }, ExtArgs["result"]["paymentSetting"]>
    composites: {}
  }

  type PaymentSettingGetPayload<S extends boolean | null | undefined | PaymentSettingDefaultArgs> = $Result.GetResult<Prisma.$PaymentSettingPayload, S>

  type PaymentSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentSettingCountAggregateInputType | true
    }

  export interface PaymentSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentSetting'], meta: { name: 'PaymentSetting' } }
    /**
     * Find zero or one PaymentSetting that matches the filter.
     * @param {PaymentSettingFindUniqueArgs} args - Arguments to find a PaymentSetting
     * @example
     * // Get one PaymentSetting
     * const paymentSetting = await prisma.paymentSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentSettingFindUniqueArgs>(args: SelectSubset<T, PaymentSettingFindUniqueArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentSettingFindUniqueOrThrowArgs} args - Arguments to find a PaymentSetting
     * @example
     * // Get one PaymentSetting
     * const paymentSetting = await prisma.paymentSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingFindFirstArgs} args - Arguments to find a PaymentSetting
     * @example
     * // Get one PaymentSetting
     * const paymentSetting = await prisma.paymentSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentSettingFindFirstArgs>(args?: SelectSubset<T, PaymentSettingFindFirstArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingFindFirstOrThrowArgs} args - Arguments to find a PaymentSetting
     * @example
     * // Get one PaymentSetting
     * const paymentSetting = await prisma.paymentSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentSettings
     * const paymentSettings = await prisma.paymentSetting.findMany()
     * 
     * // Get first 10 PaymentSettings
     * const paymentSettings = await prisma.paymentSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentSettingWithIdOnly = await prisma.paymentSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentSettingFindManyArgs>(args?: SelectSubset<T, PaymentSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentSetting.
     * @param {PaymentSettingCreateArgs} args - Arguments to create a PaymentSetting.
     * @example
     * // Create one PaymentSetting
     * const PaymentSetting = await prisma.paymentSetting.create({
     *   data: {
     *     // ... data to create a PaymentSetting
     *   }
     * })
     * 
     */
    create<T extends PaymentSettingCreateArgs>(args: SelectSubset<T, PaymentSettingCreateArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentSettings.
     * @param {PaymentSettingCreateManyArgs} args - Arguments to create many PaymentSettings.
     * @example
     * // Create many PaymentSettings
     * const paymentSetting = await prisma.paymentSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentSettingCreateManyArgs>(args?: SelectSubset<T, PaymentSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PaymentSetting.
     * @param {PaymentSettingDeleteArgs} args - Arguments to delete one PaymentSetting.
     * @example
     * // Delete one PaymentSetting
     * const PaymentSetting = await prisma.paymentSetting.delete({
     *   where: {
     *     // ... filter to delete one PaymentSetting
     *   }
     * })
     * 
     */
    delete<T extends PaymentSettingDeleteArgs>(args: SelectSubset<T, PaymentSettingDeleteArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentSetting.
     * @param {PaymentSettingUpdateArgs} args - Arguments to update one PaymentSetting.
     * @example
     * // Update one PaymentSetting
     * const paymentSetting = await prisma.paymentSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentSettingUpdateArgs>(args: SelectSubset<T, PaymentSettingUpdateArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentSettings.
     * @param {PaymentSettingDeleteManyArgs} args - Arguments to filter PaymentSettings to delete.
     * @example
     * // Delete a few PaymentSettings
     * const { count } = await prisma.paymentSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentSettingDeleteManyArgs>(args?: SelectSubset<T, PaymentSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentSettings
     * const paymentSetting = await prisma.paymentSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentSettingUpdateManyArgs>(args: SelectSubset<T, PaymentSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentSetting.
     * @param {PaymentSettingUpsertArgs} args - Arguments to update or create a PaymentSetting.
     * @example
     * // Update or create a PaymentSetting
     * const paymentSetting = await prisma.paymentSetting.upsert({
     *   create: {
     *     // ... data to create a PaymentSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentSetting we want to update
     *   }
     * })
     */
    upsert<T extends PaymentSettingUpsertArgs>(args: SelectSubset<T, PaymentSettingUpsertArgs<ExtArgs>>): Prisma__PaymentSettingClient<$Result.GetResult<Prisma.$PaymentSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingCountArgs} args - Arguments to filter PaymentSettings to count.
     * @example
     * // Count the number of PaymentSettings
     * const count = await prisma.paymentSetting.count({
     *   where: {
     *     // ... the filter for the PaymentSettings we want to count
     *   }
     * })
    **/
    count<T extends PaymentSettingCountArgs>(
      args?: Subset<T, PaymentSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentSettingAggregateArgs>(args: Subset<T, PaymentSettingAggregateArgs>): Prisma.PrismaPromise<GetPaymentSettingAggregateType<T>>

    /**
     * Group by PaymentSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentSettingGroupByArgs['orderBy'] }
        : { orderBy?: PaymentSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentSetting model
   */
  readonly fields: PaymentSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentSetting model
   */
  interface PaymentSettingFieldRefs {
    readonly id: FieldRef<"PaymentSetting", 'String'>
    readonly method: FieldRef<"PaymentSetting", 'String'>
    readonly phone: FieldRef<"PaymentSetting", 'String'>
    readonly name: FieldRef<"PaymentSetting", 'String'>
    readonly address: FieldRef<"PaymentSetting", 'String'>
    readonly active: FieldRef<"PaymentSetting", 'Boolean'>
    readonly updatedAt: FieldRef<"PaymentSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentSetting findUnique
   */
  export type PaymentSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * Filter, which PaymentSetting to fetch.
     */
    where: PaymentSettingWhereUniqueInput
  }

  /**
   * PaymentSetting findUniqueOrThrow
   */
  export type PaymentSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * Filter, which PaymentSetting to fetch.
     */
    where: PaymentSettingWhereUniqueInput
  }

  /**
   * PaymentSetting findFirst
   */
  export type PaymentSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * Filter, which PaymentSetting to fetch.
     */
    where?: PaymentSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentSettings to fetch.
     */
    orderBy?: PaymentSettingOrderByWithRelationInput | PaymentSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentSettings.
     */
    cursor?: PaymentSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentSettings.
     */
    distinct?: PaymentSettingScalarFieldEnum | PaymentSettingScalarFieldEnum[]
  }

  /**
   * PaymentSetting findFirstOrThrow
   */
  export type PaymentSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * Filter, which PaymentSetting to fetch.
     */
    where?: PaymentSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentSettings to fetch.
     */
    orderBy?: PaymentSettingOrderByWithRelationInput | PaymentSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentSettings.
     */
    cursor?: PaymentSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentSettings.
     */
    distinct?: PaymentSettingScalarFieldEnum | PaymentSettingScalarFieldEnum[]
  }

  /**
   * PaymentSetting findMany
   */
  export type PaymentSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * Filter, which PaymentSettings to fetch.
     */
    where?: PaymentSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentSettings to fetch.
     */
    orderBy?: PaymentSettingOrderByWithRelationInput | PaymentSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentSettings.
     */
    cursor?: PaymentSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentSettings.
     */
    distinct?: PaymentSettingScalarFieldEnum | PaymentSettingScalarFieldEnum[]
  }

  /**
   * PaymentSetting create
   */
  export type PaymentSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a PaymentSetting.
     */
    data: XOR<PaymentSettingCreateInput, PaymentSettingUncheckedCreateInput>
  }

  /**
   * PaymentSetting createMany
   */
  export type PaymentSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentSettings.
     */
    data: PaymentSettingCreateManyInput | PaymentSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentSetting update
   */
  export type PaymentSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a PaymentSetting.
     */
    data: XOR<PaymentSettingUpdateInput, PaymentSettingUncheckedUpdateInput>
    /**
     * Choose, which PaymentSetting to update.
     */
    where: PaymentSettingWhereUniqueInput
  }

  /**
   * PaymentSetting updateMany
   */
  export type PaymentSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentSettings.
     */
    data: XOR<PaymentSettingUpdateManyMutationInput, PaymentSettingUncheckedUpdateManyInput>
    /**
     * Filter which PaymentSettings to update
     */
    where?: PaymentSettingWhereInput
    /**
     * Limit how many PaymentSettings to update.
     */
    limit?: number
  }

  /**
   * PaymentSetting upsert
   */
  export type PaymentSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the PaymentSetting to update in case it exists.
     */
    where: PaymentSettingWhereUniqueInput
    /**
     * In case the PaymentSetting found by the `where` argument doesn't exist, create a new PaymentSetting with this data.
     */
    create: XOR<PaymentSettingCreateInput, PaymentSettingUncheckedCreateInput>
    /**
     * In case the PaymentSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentSettingUpdateInput, PaymentSettingUncheckedUpdateInput>
  }

  /**
   * PaymentSetting delete
   */
  export type PaymentSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
    /**
     * Filter which PaymentSetting to delete.
     */
    where: PaymentSettingWhereUniqueInput
  }

  /**
   * PaymentSetting deleteMany
   */
  export type PaymentSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentSettings to delete
     */
    where?: PaymentSettingWhereInput
    /**
     * Limit how many PaymentSettings to delete.
     */
    limit?: number
  }

  /**
   * PaymentSetting without action
   */
  export type PaymentSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentSetting
     */
    select?: PaymentSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentSetting
     */
    omit?: PaymentSettingOmit<ExtArgs> | null
  }


  /**
   * Model SavedJob
   */

  export type AggregateSavedJob = {
    _count: SavedJobCountAggregateOutputType | null
    _min: SavedJobMinAggregateOutputType | null
    _max: SavedJobMaxAggregateOutputType | null
  }

  export type SavedJobMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    savedAt: Date | null
  }

  export type SavedJobMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    savedAt: Date | null
  }

  export type SavedJobCountAggregateOutputType = {
    id: number
    userId: number
    jobId: number
    savedAt: number
    _all: number
  }


  export type SavedJobMinAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    savedAt?: true
  }

  export type SavedJobMaxAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    savedAt?: true
  }

  export type SavedJobCountAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    savedAt?: true
    _all?: true
  }

  export type SavedJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedJob to aggregate.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SavedJobs
    **/
    _count?: true | SavedJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SavedJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SavedJobMaxAggregateInputType
  }

  export type GetSavedJobAggregateType<T extends SavedJobAggregateArgs> = {
        [P in keyof T & keyof AggregateSavedJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSavedJob[P]>
      : GetScalarType<T[P], AggregateSavedJob[P]>
  }




  export type SavedJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedJobWhereInput
    orderBy?: SavedJobOrderByWithAggregationInput | SavedJobOrderByWithAggregationInput[]
    by: SavedJobScalarFieldEnum[] | SavedJobScalarFieldEnum
    having?: SavedJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SavedJobCountAggregateInputType | true
    _min?: SavedJobMinAggregateInputType
    _max?: SavedJobMaxAggregateInputType
  }

  export type SavedJobGroupByOutputType = {
    id: string
    userId: string
    jobId: string
    savedAt: Date
    _count: SavedJobCountAggregateOutputType | null
    _min: SavedJobMinAggregateOutputType | null
    _max: SavedJobMaxAggregateOutputType | null
  }

  type GetSavedJobGroupByPayload<T extends SavedJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SavedJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SavedJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SavedJobGroupByOutputType[P]>
            : GetScalarType<T[P], SavedJobGroupByOutputType[P]>
        }
      >
    >


  export type SavedJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    savedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedJob"]>



  export type SavedJobSelectScalar = {
    id?: boolean
    userId?: boolean
    jobId?: boolean
    savedAt?: boolean
  }

  export type SavedJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "jobId" | "savedAt", ExtArgs["result"]["savedJob"]>
  export type SavedJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    job?: boolean | JobDefaultArgs<ExtArgs>
  }

  export type $SavedJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SavedJob"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      job: Prisma.$JobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobId: string
      savedAt: Date
    }, ExtArgs["result"]["savedJob"]>
    composites: {}
  }

  type SavedJobGetPayload<S extends boolean | null | undefined | SavedJobDefaultArgs> = $Result.GetResult<Prisma.$SavedJobPayload, S>

  type SavedJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SavedJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SavedJobCountAggregateInputType | true
    }

  export interface SavedJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SavedJob'], meta: { name: 'SavedJob' } }
    /**
     * Find zero or one SavedJob that matches the filter.
     * @param {SavedJobFindUniqueArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavedJobFindUniqueArgs>(args: SelectSubset<T, SavedJobFindUniqueArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SavedJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SavedJobFindUniqueOrThrowArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavedJobFindUniqueOrThrowArgs>(args: SelectSubset<T, SavedJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobFindFirstArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavedJobFindFirstArgs>(args?: SelectSubset<T, SavedJobFindFirstArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobFindFirstOrThrowArgs} args - Arguments to find a SavedJob
     * @example
     * // Get one SavedJob
     * const savedJob = await prisma.savedJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavedJobFindFirstOrThrowArgs>(args?: SelectSubset<T, SavedJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SavedJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavedJobs
     * const savedJobs = await prisma.savedJob.findMany()
     * 
     * // Get first 10 SavedJobs
     * const savedJobs = await prisma.savedJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const savedJobWithIdOnly = await prisma.savedJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SavedJobFindManyArgs>(args?: SelectSubset<T, SavedJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SavedJob.
     * @param {SavedJobCreateArgs} args - Arguments to create a SavedJob.
     * @example
     * // Create one SavedJob
     * const SavedJob = await prisma.savedJob.create({
     *   data: {
     *     // ... data to create a SavedJob
     *   }
     * })
     * 
     */
    create<T extends SavedJobCreateArgs>(args: SelectSubset<T, SavedJobCreateArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SavedJobs.
     * @param {SavedJobCreateManyArgs} args - Arguments to create many SavedJobs.
     * @example
     * // Create many SavedJobs
     * const savedJob = await prisma.savedJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SavedJobCreateManyArgs>(args?: SelectSubset<T, SavedJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SavedJob.
     * @param {SavedJobDeleteArgs} args - Arguments to delete one SavedJob.
     * @example
     * // Delete one SavedJob
     * const SavedJob = await prisma.savedJob.delete({
     *   where: {
     *     // ... filter to delete one SavedJob
     *   }
     * })
     * 
     */
    delete<T extends SavedJobDeleteArgs>(args: SelectSubset<T, SavedJobDeleteArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SavedJob.
     * @param {SavedJobUpdateArgs} args - Arguments to update one SavedJob.
     * @example
     * // Update one SavedJob
     * const savedJob = await prisma.savedJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SavedJobUpdateArgs>(args: SelectSubset<T, SavedJobUpdateArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SavedJobs.
     * @param {SavedJobDeleteManyArgs} args - Arguments to filter SavedJobs to delete.
     * @example
     * // Delete a few SavedJobs
     * const { count } = await prisma.savedJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SavedJobDeleteManyArgs>(args?: SelectSubset<T, SavedJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavedJobs
     * const savedJob = await prisma.savedJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SavedJobUpdateManyArgs>(args: SelectSubset<T, SavedJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SavedJob.
     * @param {SavedJobUpsertArgs} args - Arguments to update or create a SavedJob.
     * @example
     * // Update or create a SavedJob
     * const savedJob = await prisma.savedJob.upsert({
     *   create: {
     *     // ... data to create a SavedJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavedJob we want to update
     *   }
     * })
     */
    upsert<T extends SavedJobUpsertArgs>(args: SelectSubset<T, SavedJobUpsertArgs<ExtArgs>>): Prisma__SavedJobClient<$Result.GetResult<Prisma.$SavedJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SavedJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobCountArgs} args - Arguments to filter SavedJobs to count.
     * @example
     * // Count the number of SavedJobs
     * const count = await prisma.savedJob.count({
     *   where: {
     *     // ... the filter for the SavedJobs we want to count
     *   }
     * })
    **/
    count<T extends SavedJobCountArgs>(
      args?: Subset<T, SavedJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SavedJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SavedJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SavedJobAggregateArgs>(args: Subset<T, SavedJobAggregateArgs>): Prisma.PrismaPromise<GetSavedJobAggregateType<T>>

    /**
     * Group by SavedJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SavedJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SavedJobGroupByArgs['orderBy'] }
        : { orderBy?: SavedJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SavedJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SavedJob model
   */
  readonly fields: SavedJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SavedJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SavedJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SavedJob model
   */
  interface SavedJobFieldRefs {
    readonly id: FieldRef<"SavedJob", 'String'>
    readonly userId: FieldRef<"SavedJob", 'String'>
    readonly jobId: FieldRef<"SavedJob", 'String'>
    readonly savedAt: FieldRef<"SavedJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SavedJob findUnique
   */
  export type SavedJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob findUniqueOrThrow
   */
  export type SavedJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob findFirst
   */
  export type SavedJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedJobs.
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedJobs.
     */
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * SavedJob findFirstOrThrow
   */
  export type SavedJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJob to fetch.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedJobs.
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedJobs.
     */
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * SavedJob findMany
   */
  export type SavedJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter, which SavedJobs to fetch.
     */
    where?: SavedJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedJobs to fetch.
     */
    orderBy?: SavedJobOrderByWithRelationInput | SavedJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SavedJobs.
     */
    cursor?: SavedJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedJobs.
     */
    distinct?: SavedJobScalarFieldEnum | SavedJobScalarFieldEnum[]
  }

  /**
   * SavedJob create
   */
  export type SavedJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * The data needed to create a SavedJob.
     */
    data: XOR<SavedJobCreateInput, SavedJobUncheckedCreateInput>
  }

  /**
   * SavedJob createMany
   */
  export type SavedJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavedJobs.
     */
    data: SavedJobCreateManyInput | SavedJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedJob update
   */
  export type SavedJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * The data needed to update a SavedJob.
     */
    data: XOR<SavedJobUpdateInput, SavedJobUncheckedUpdateInput>
    /**
     * Choose, which SavedJob to update.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob updateMany
   */
  export type SavedJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SavedJobs.
     */
    data: XOR<SavedJobUpdateManyMutationInput, SavedJobUncheckedUpdateManyInput>
    /**
     * Filter which SavedJobs to update
     */
    where?: SavedJobWhereInput
    /**
     * Limit how many SavedJobs to update.
     */
    limit?: number
  }

  /**
   * SavedJob upsert
   */
  export type SavedJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * The filter to search for the SavedJob to update in case it exists.
     */
    where: SavedJobWhereUniqueInput
    /**
     * In case the SavedJob found by the `where` argument doesn't exist, create a new SavedJob with this data.
     */
    create: XOR<SavedJobCreateInput, SavedJobUncheckedCreateInput>
    /**
     * In case the SavedJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SavedJobUpdateInput, SavedJobUncheckedUpdateInput>
  }

  /**
   * SavedJob delete
   */
  export type SavedJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
    /**
     * Filter which SavedJob to delete.
     */
    where: SavedJobWhereUniqueInput
  }

  /**
   * SavedJob deleteMany
   */
  export type SavedJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedJobs to delete
     */
    where?: SavedJobWhereInput
    /**
     * Limit how many SavedJobs to delete.
     */
    limit?: number
  }

  /**
   * SavedJob without action
   */
  export type SavedJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedJob
     */
    select?: SavedJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedJob
     */
    omit?: SavedJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedJobInclude<ExtArgs> | null
  }


  /**
   * Model Alert
   */

  export type AggregateAlert = {
    _count: AlertCountAggregateOutputType | null
    _min: AlertMinAggregateOutputType | null
    _max: AlertMaxAggregateOutputType | null
  }

  export type AlertMinAggregateOutputType = {
    id: string | null
    userId: string | null
    keywords: string | null
    location: string | null
    type: string | null
    frequency: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlertMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    keywords: string | null
    location: string | null
    type: string | null
    frequency: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlertCountAggregateOutputType = {
    id: number
    userId: number
    keywords: number
    location: number
    type: number
    frequency: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AlertMinAggregateInputType = {
    id?: true
    userId?: true
    keywords?: true
    location?: true
    type?: true
    frequency?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlertMaxAggregateInputType = {
    id?: true
    userId?: true
    keywords?: true
    location?: true
    type?: true
    frequency?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlertCountAggregateInputType = {
    id?: true
    userId?: true
    keywords?: true
    location?: true
    type?: true
    frequency?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alert to aggregate.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alerts
    **/
    _count?: true | AlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlertMaxAggregateInputType
  }

  export type GetAlertAggregateType<T extends AlertAggregateArgs> = {
        [P in keyof T & keyof AggregateAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlert[P]>
      : GetScalarType<T[P], AggregateAlert[P]>
  }




  export type AlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertWhereInput
    orderBy?: AlertOrderByWithAggregationInput | AlertOrderByWithAggregationInput[]
    by: AlertScalarFieldEnum[] | AlertScalarFieldEnum
    having?: AlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlertCountAggregateInputType | true
    _min?: AlertMinAggregateInputType
    _max?: AlertMaxAggregateInputType
  }

  export type AlertGroupByOutputType = {
    id: string
    userId: string
    keywords: string
    location: string
    type: string
    frequency: string
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: AlertCountAggregateOutputType | null
    _min: AlertMinAggregateOutputType | null
    _max: AlertMaxAggregateOutputType | null
  }

  type GetAlertGroupByPayload<T extends AlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertGroupByOutputType[P]>
            : GetScalarType<T[P], AlertGroupByOutputType[P]>
        }
      >
    >


  export type AlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    keywords?: boolean
    location?: boolean
    type?: boolean
    frequency?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alert"]>



  export type AlertSelectScalar = {
    id?: boolean
    userId?: boolean
    keywords?: boolean
    location?: boolean
    type?: boolean
    frequency?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AlertOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "keywords" | "location" | "type" | "frequency" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["alert"]>
  export type AlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Alert"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      keywords: string
      location: string
      type: string
      frequency: string
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["alert"]>
    composites: {}
  }

  type AlertGetPayload<S extends boolean | null | undefined | AlertDefaultArgs> = $Result.GetResult<Prisma.$AlertPayload, S>

  type AlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlertCountAggregateInputType | true
    }

  export interface AlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Alert'], meta: { name: 'Alert' } }
    /**
     * Find zero or one Alert that matches the filter.
     * @param {AlertFindUniqueArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertFindUniqueArgs>(args: SelectSubset<T, AlertFindUniqueArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Alert that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlertFindUniqueOrThrowArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertFindUniqueOrThrowArgs>(args: SelectSubset<T, AlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindFirstArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertFindFirstArgs>(args?: SelectSubset<T, AlertFindFirstArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Alert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindFirstOrThrowArgs} args - Arguments to find a Alert
     * @example
     * // Get one Alert
     * const alert = await prisma.alert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertFindFirstOrThrowArgs>(args?: SelectSubset<T, AlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Alerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alerts
     * const alerts = await prisma.alert.findMany()
     * 
     * // Get first 10 Alerts
     * const alerts = await prisma.alert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alertWithIdOnly = await prisma.alert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlertFindManyArgs>(args?: SelectSubset<T, AlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Alert.
     * @param {AlertCreateArgs} args - Arguments to create a Alert.
     * @example
     * // Create one Alert
     * const Alert = await prisma.alert.create({
     *   data: {
     *     // ... data to create a Alert
     *   }
     * })
     * 
     */
    create<T extends AlertCreateArgs>(args: SelectSubset<T, AlertCreateArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Alerts.
     * @param {AlertCreateManyArgs} args - Arguments to create many Alerts.
     * @example
     * // Create many Alerts
     * const alert = await prisma.alert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlertCreateManyArgs>(args?: SelectSubset<T, AlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Alert.
     * @param {AlertDeleteArgs} args - Arguments to delete one Alert.
     * @example
     * // Delete one Alert
     * const Alert = await prisma.alert.delete({
     *   where: {
     *     // ... filter to delete one Alert
     *   }
     * })
     * 
     */
    delete<T extends AlertDeleteArgs>(args: SelectSubset<T, AlertDeleteArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Alert.
     * @param {AlertUpdateArgs} args - Arguments to update one Alert.
     * @example
     * // Update one Alert
     * const alert = await prisma.alert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlertUpdateArgs>(args: SelectSubset<T, AlertUpdateArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Alerts.
     * @param {AlertDeleteManyArgs} args - Arguments to filter Alerts to delete.
     * @example
     * // Delete a few Alerts
     * const { count } = await prisma.alert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlertDeleteManyArgs>(args?: SelectSubset<T, AlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alerts
     * const alert = await prisma.alert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlertUpdateManyArgs>(args: SelectSubset<T, AlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Alert.
     * @param {AlertUpsertArgs} args - Arguments to update or create a Alert.
     * @example
     * // Update or create a Alert
     * const alert = await prisma.alert.upsert({
     *   create: {
     *     // ... data to create a Alert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alert we want to update
     *   }
     * })
     */
    upsert<T extends AlertUpsertArgs>(args: SelectSubset<T, AlertUpsertArgs<ExtArgs>>): Prisma__AlertClient<$Result.GetResult<Prisma.$AlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertCountArgs} args - Arguments to filter Alerts to count.
     * @example
     * // Count the number of Alerts
     * const count = await prisma.alert.count({
     *   where: {
     *     // ... the filter for the Alerts we want to count
     *   }
     * })
    **/
    count<T extends AlertCountArgs>(
      args?: Subset<T, AlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlertAggregateArgs>(args: Subset<T, AlertAggregateArgs>): Prisma.PrismaPromise<GetAlertAggregateType<T>>

    /**
     * Group by Alert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertGroupByArgs['orderBy'] }
        : { orderBy?: AlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Alert model
   */
  readonly fields: AlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Alert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Alert model
   */
  interface AlertFieldRefs {
    readonly id: FieldRef<"Alert", 'String'>
    readonly userId: FieldRef<"Alert", 'String'>
    readonly keywords: FieldRef<"Alert", 'String'>
    readonly location: FieldRef<"Alert", 'String'>
    readonly type: FieldRef<"Alert", 'String'>
    readonly frequency: FieldRef<"Alert", 'String'>
    readonly active: FieldRef<"Alert", 'Boolean'>
    readonly createdAt: FieldRef<"Alert", 'DateTime'>
    readonly updatedAt: FieldRef<"Alert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Alert findUnique
   */
  export type AlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert findUniqueOrThrow
   */
  export type AlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert findFirst
   */
  export type AlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert findFirstOrThrow
   */
  export type AlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alert to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert findMany
   */
  export type AlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter, which Alerts to fetch.
     */
    where?: AlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alerts to fetch.
     */
    orderBy?: AlertOrderByWithRelationInput | AlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alerts.
     */
    cursor?: AlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alerts.
     */
    distinct?: AlertScalarFieldEnum | AlertScalarFieldEnum[]
  }

  /**
   * Alert create
   */
  export type AlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The data needed to create a Alert.
     */
    data: XOR<AlertCreateInput, AlertUncheckedCreateInput>
  }

  /**
   * Alert createMany
   */
  export type AlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alerts.
     */
    data: AlertCreateManyInput | AlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Alert update
   */
  export type AlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The data needed to update a Alert.
     */
    data: XOR<AlertUpdateInput, AlertUncheckedUpdateInput>
    /**
     * Choose, which Alert to update.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert updateMany
   */
  export type AlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alerts.
     */
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyInput>
    /**
     * Filter which Alerts to update
     */
    where?: AlertWhereInput
    /**
     * Limit how many Alerts to update.
     */
    limit?: number
  }

  /**
   * Alert upsert
   */
  export type AlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * The filter to search for the Alert to update in case it exists.
     */
    where: AlertWhereUniqueInput
    /**
     * In case the Alert found by the `where` argument doesn't exist, create a new Alert with this data.
     */
    create: XOR<AlertCreateInput, AlertUncheckedCreateInput>
    /**
     * In case the Alert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertUpdateInput, AlertUncheckedUpdateInput>
  }

  /**
   * Alert delete
   */
  export type AlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
    /**
     * Filter which Alert to delete.
     */
    where: AlertWhereUniqueInput
  }

  /**
   * Alert deleteMany
   */
  export type AlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alerts to delete
     */
    where?: AlertWhereInput
    /**
     * Limit how many Alerts to delete.
     */
    limit?: number
  }

  /**
   * Alert without action
   */
  export type AlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alert
     */
    select?: AlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Alert
     */
    omit?: AlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlertInclude<ExtArgs> | null
  }


  /**
   * Model AnalyticsSummary
   */

  export type AggregateAnalyticsSummary = {
    _count: AnalyticsSummaryCountAggregateOutputType | null
    _avg: AnalyticsSummaryAvgAggregateOutputType | null
    _sum: AnalyticsSummarySumAggregateOutputType | null
    _min: AnalyticsSummaryMinAggregateOutputType | null
    _max: AnalyticsSummaryMaxAggregateOutputType | null
  }

  export type AnalyticsSummaryAvgAggregateOutputType = {
    visitors: number | null
    pageViews: number | null
    applications: number | null
    newUsers: number | null
  }

  export type AnalyticsSummarySumAggregateOutputType = {
    visitors: number | null
    pageViews: number | null
    applications: number | null
    newUsers: number | null
  }

  export type AnalyticsSummaryMinAggregateOutputType = {
    id: string | null
    date: Date | null
    visitors: number | null
    pageViews: number | null
    applications: number | null
    newUsers: number | null
  }

  export type AnalyticsSummaryMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    visitors: number | null
    pageViews: number | null
    applications: number | null
    newUsers: number | null
  }

  export type AnalyticsSummaryCountAggregateOutputType = {
    id: number
    date: number
    visitors: number
    pageViews: number
    applications: number
    newUsers: number
    _all: number
  }


  export type AnalyticsSummaryAvgAggregateInputType = {
    visitors?: true
    pageViews?: true
    applications?: true
    newUsers?: true
  }

  export type AnalyticsSummarySumAggregateInputType = {
    visitors?: true
    pageViews?: true
    applications?: true
    newUsers?: true
  }

  export type AnalyticsSummaryMinAggregateInputType = {
    id?: true
    date?: true
    visitors?: true
    pageViews?: true
    applications?: true
    newUsers?: true
  }

  export type AnalyticsSummaryMaxAggregateInputType = {
    id?: true
    date?: true
    visitors?: true
    pageViews?: true
    applications?: true
    newUsers?: true
  }

  export type AnalyticsSummaryCountAggregateInputType = {
    id?: true
    date?: true
    visitors?: true
    pageViews?: true
    applications?: true
    newUsers?: true
    _all?: true
  }

  export type AnalyticsSummaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalyticsSummary to aggregate.
     */
    where?: AnalyticsSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsSummaries to fetch.
     */
    orderBy?: AnalyticsSummaryOrderByWithRelationInput | AnalyticsSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalyticsSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalyticsSummaries
    **/
    _count?: true | AnalyticsSummaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalyticsSummaryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalyticsSummarySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalyticsSummaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalyticsSummaryMaxAggregateInputType
  }

  export type GetAnalyticsSummaryAggregateType<T extends AnalyticsSummaryAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalyticsSummary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalyticsSummary[P]>
      : GetScalarType<T[P], AggregateAnalyticsSummary[P]>
  }




  export type AnalyticsSummaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsSummaryWhereInput
    orderBy?: AnalyticsSummaryOrderByWithAggregationInput | AnalyticsSummaryOrderByWithAggregationInput[]
    by: AnalyticsSummaryScalarFieldEnum[] | AnalyticsSummaryScalarFieldEnum
    having?: AnalyticsSummaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalyticsSummaryCountAggregateInputType | true
    _avg?: AnalyticsSummaryAvgAggregateInputType
    _sum?: AnalyticsSummarySumAggregateInputType
    _min?: AnalyticsSummaryMinAggregateInputType
    _max?: AnalyticsSummaryMaxAggregateInputType
  }

  export type AnalyticsSummaryGroupByOutputType = {
    id: string
    date: Date
    visitors: number
    pageViews: number
    applications: number
    newUsers: number
    _count: AnalyticsSummaryCountAggregateOutputType | null
    _avg: AnalyticsSummaryAvgAggregateOutputType | null
    _sum: AnalyticsSummarySumAggregateOutputType | null
    _min: AnalyticsSummaryMinAggregateOutputType | null
    _max: AnalyticsSummaryMaxAggregateOutputType | null
  }

  type GetAnalyticsSummaryGroupByPayload<T extends AnalyticsSummaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalyticsSummaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalyticsSummaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalyticsSummaryGroupByOutputType[P]>
            : GetScalarType<T[P], AnalyticsSummaryGroupByOutputType[P]>
        }
      >
    >


  export type AnalyticsSummarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    visitors?: boolean
    pageViews?: boolean
    applications?: boolean
    newUsers?: boolean
  }, ExtArgs["result"]["analyticsSummary"]>



  export type AnalyticsSummarySelectScalar = {
    id?: boolean
    date?: boolean
    visitors?: boolean
    pageViews?: boolean
    applications?: boolean
    newUsers?: boolean
  }

  export type AnalyticsSummaryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "visitors" | "pageViews" | "applications" | "newUsers", ExtArgs["result"]["analyticsSummary"]>

  export type $AnalyticsSummaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalyticsSummary"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      visitors: number
      pageViews: number
      applications: number
      newUsers: number
    }, ExtArgs["result"]["analyticsSummary"]>
    composites: {}
  }

  type AnalyticsSummaryGetPayload<S extends boolean | null | undefined | AnalyticsSummaryDefaultArgs> = $Result.GetResult<Prisma.$AnalyticsSummaryPayload, S>

  type AnalyticsSummaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalyticsSummaryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalyticsSummaryCountAggregateInputType | true
    }

  export interface AnalyticsSummaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalyticsSummary'], meta: { name: 'AnalyticsSummary' } }
    /**
     * Find zero or one AnalyticsSummary that matches the filter.
     * @param {AnalyticsSummaryFindUniqueArgs} args - Arguments to find a AnalyticsSummary
     * @example
     * // Get one AnalyticsSummary
     * const analyticsSummary = await prisma.analyticsSummary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalyticsSummaryFindUniqueArgs>(args: SelectSubset<T, AnalyticsSummaryFindUniqueArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalyticsSummary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalyticsSummaryFindUniqueOrThrowArgs} args - Arguments to find a AnalyticsSummary
     * @example
     * // Get one AnalyticsSummary
     * const analyticsSummary = await prisma.analyticsSummary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalyticsSummaryFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalyticsSummaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalyticsSummary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryFindFirstArgs} args - Arguments to find a AnalyticsSummary
     * @example
     * // Get one AnalyticsSummary
     * const analyticsSummary = await prisma.analyticsSummary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalyticsSummaryFindFirstArgs>(args?: SelectSubset<T, AnalyticsSummaryFindFirstArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalyticsSummary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryFindFirstOrThrowArgs} args - Arguments to find a AnalyticsSummary
     * @example
     * // Get one AnalyticsSummary
     * const analyticsSummary = await prisma.analyticsSummary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalyticsSummaryFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalyticsSummaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalyticsSummaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalyticsSummaries
     * const analyticsSummaries = await prisma.analyticsSummary.findMany()
     * 
     * // Get first 10 AnalyticsSummaries
     * const analyticsSummaries = await prisma.analyticsSummary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analyticsSummaryWithIdOnly = await prisma.analyticsSummary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalyticsSummaryFindManyArgs>(args?: SelectSubset<T, AnalyticsSummaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalyticsSummary.
     * @param {AnalyticsSummaryCreateArgs} args - Arguments to create a AnalyticsSummary.
     * @example
     * // Create one AnalyticsSummary
     * const AnalyticsSummary = await prisma.analyticsSummary.create({
     *   data: {
     *     // ... data to create a AnalyticsSummary
     *   }
     * })
     * 
     */
    create<T extends AnalyticsSummaryCreateArgs>(args: SelectSubset<T, AnalyticsSummaryCreateArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalyticsSummaries.
     * @param {AnalyticsSummaryCreateManyArgs} args - Arguments to create many AnalyticsSummaries.
     * @example
     * // Create many AnalyticsSummaries
     * const analyticsSummary = await prisma.analyticsSummary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalyticsSummaryCreateManyArgs>(args?: SelectSubset<T, AnalyticsSummaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AnalyticsSummary.
     * @param {AnalyticsSummaryDeleteArgs} args - Arguments to delete one AnalyticsSummary.
     * @example
     * // Delete one AnalyticsSummary
     * const AnalyticsSummary = await prisma.analyticsSummary.delete({
     *   where: {
     *     // ... filter to delete one AnalyticsSummary
     *   }
     * })
     * 
     */
    delete<T extends AnalyticsSummaryDeleteArgs>(args: SelectSubset<T, AnalyticsSummaryDeleteArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalyticsSummary.
     * @param {AnalyticsSummaryUpdateArgs} args - Arguments to update one AnalyticsSummary.
     * @example
     * // Update one AnalyticsSummary
     * const analyticsSummary = await prisma.analyticsSummary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalyticsSummaryUpdateArgs>(args: SelectSubset<T, AnalyticsSummaryUpdateArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalyticsSummaries.
     * @param {AnalyticsSummaryDeleteManyArgs} args - Arguments to filter AnalyticsSummaries to delete.
     * @example
     * // Delete a few AnalyticsSummaries
     * const { count } = await prisma.analyticsSummary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalyticsSummaryDeleteManyArgs>(args?: SelectSubset<T, AnalyticsSummaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalyticsSummaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalyticsSummaries
     * const analyticsSummary = await prisma.analyticsSummary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalyticsSummaryUpdateManyArgs>(args: SelectSubset<T, AnalyticsSummaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AnalyticsSummary.
     * @param {AnalyticsSummaryUpsertArgs} args - Arguments to update or create a AnalyticsSummary.
     * @example
     * // Update or create a AnalyticsSummary
     * const analyticsSummary = await prisma.analyticsSummary.upsert({
     *   create: {
     *     // ... data to create a AnalyticsSummary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalyticsSummary we want to update
     *   }
     * })
     */
    upsert<T extends AnalyticsSummaryUpsertArgs>(args: SelectSubset<T, AnalyticsSummaryUpsertArgs<ExtArgs>>): Prisma__AnalyticsSummaryClient<$Result.GetResult<Prisma.$AnalyticsSummaryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalyticsSummaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryCountArgs} args - Arguments to filter AnalyticsSummaries to count.
     * @example
     * // Count the number of AnalyticsSummaries
     * const count = await prisma.analyticsSummary.count({
     *   where: {
     *     // ... the filter for the AnalyticsSummaries we want to count
     *   }
     * })
    **/
    count<T extends AnalyticsSummaryCountArgs>(
      args?: Subset<T, AnalyticsSummaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalyticsSummaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalyticsSummary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalyticsSummaryAggregateArgs>(args: Subset<T, AnalyticsSummaryAggregateArgs>): Prisma.PrismaPromise<GetAnalyticsSummaryAggregateType<T>>

    /**
     * Group by AnalyticsSummary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsSummaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalyticsSummaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalyticsSummaryGroupByArgs['orderBy'] }
        : { orderBy?: AnalyticsSummaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalyticsSummaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalyticsSummaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalyticsSummary model
   */
  readonly fields: AnalyticsSummaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalyticsSummary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalyticsSummaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalyticsSummary model
   */
  interface AnalyticsSummaryFieldRefs {
    readonly id: FieldRef<"AnalyticsSummary", 'String'>
    readonly date: FieldRef<"AnalyticsSummary", 'DateTime'>
    readonly visitors: FieldRef<"AnalyticsSummary", 'Int'>
    readonly pageViews: FieldRef<"AnalyticsSummary", 'Int'>
    readonly applications: FieldRef<"AnalyticsSummary", 'Int'>
    readonly newUsers: FieldRef<"AnalyticsSummary", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * AnalyticsSummary findUnique
   */
  export type AnalyticsSummaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * Filter, which AnalyticsSummary to fetch.
     */
    where: AnalyticsSummaryWhereUniqueInput
  }

  /**
   * AnalyticsSummary findUniqueOrThrow
   */
  export type AnalyticsSummaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * Filter, which AnalyticsSummary to fetch.
     */
    where: AnalyticsSummaryWhereUniqueInput
  }

  /**
   * AnalyticsSummary findFirst
   */
  export type AnalyticsSummaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * Filter, which AnalyticsSummary to fetch.
     */
    where?: AnalyticsSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsSummaries to fetch.
     */
    orderBy?: AnalyticsSummaryOrderByWithRelationInput | AnalyticsSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalyticsSummaries.
     */
    cursor?: AnalyticsSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsSummaries.
     */
    distinct?: AnalyticsSummaryScalarFieldEnum | AnalyticsSummaryScalarFieldEnum[]
  }

  /**
   * AnalyticsSummary findFirstOrThrow
   */
  export type AnalyticsSummaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * Filter, which AnalyticsSummary to fetch.
     */
    where?: AnalyticsSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsSummaries to fetch.
     */
    orderBy?: AnalyticsSummaryOrderByWithRelationInput | AnalyticsSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalyticsSummaries.
     */
    cursor?: AnalyticsSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsSummaries.
     */
    distinct?: AnalyticsSummaryScalarFieldEnum | AnalyticsSummaryScalarFieldEnum[]
  }

  /**
   * AnalyticsSummary findMany
   */
  export type AnalyticsSummaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * Filter, which AnalyticsSummaries to fetch.
     */
    where?: AnalyticsSummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsSummaries to fetch.
     */
    orderBy?: AnalyticsSummaryOrderByWithRelationInput | AnalyticsSummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalyticsSummaries.
     */
    cursor?: AnalyticsSummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsSummaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsSummaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsSummaries.
     */
    distinct?: AnalyticsSummaryScalarFieldEnum | AnalyticsSummaryScalarFieldEnum[]
  }

  /**
   * AnalyticsSummary create
   */
  export type AnalyticsSummaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * The data needed to create a AnalyticsSummary.
     */
    data: XOR<AnalyticsSummaryCreateInput, AnalyticsSummaryUncheckedCreateInput>
  }

  /**
   * AnalyticsSummary createMany
   */
  export type AnalyticsSummaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalyticsSummaries.
     */
    data: AnalyticsSummaryCreateManyInput | AnalyticsSummaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalyticsSummary update
   */
  export type AnalyticsSummaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * The data needed to update a AnalyticsSummary.
     */
    data: XOR<AnalyticsSummaryUpdateInput, AnalyticsSummaryUncheckedUpdateInput>
    /**
     * Choose, which AnalyticsSummary to update.
     */
    where: AnalyticsSummaryWhereUniqueInput
  }

  /**
   * AnalyticsSummary updateMany
   */
  export type AnalyticsSummaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalyticsSummaries.
     */
    data: XOR<AnalyticsSummaryUpdateManyMutationInput, AnalyticsSummaryUncheckedUpdateManyInput>
    /**
     * Filter which AnalyticsSummaries to update
     */
    where?: AnalyticsSummaryWhereInput
    /**
     * Limit how many AnalyticsSummaries to update.
     */
    limit?: number
  }

  /**
   * AnalyticsSummary upsert
   */
  export type AnalyticsSummaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * The filter to search for the AnalyticsSummary to update in case it exists.
     */
    where: AnalyticsSummaryWhereUniqueInput
    /**
     * In case the AnalyticsSummary found by the `where` argument doesn't exist, create a new AnalyticsSummary with this data.
     */
    create: XOR<AnalyticsSummaryCreateInput, AnalyticsSummaryUncheckedCreateInput>
    /**
     * In case the AnalyticsSummary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalyticsSummaryUpdateInput, AnalyticsSummaryUncheckedUpdateInput>
  }

  /**
   * AnalyticsSummary delete
   */
  export type AnalyticsSummaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
    /**
     * Filter which AnalyticsSummary to delete.
     */
    where: AnalyticsSummaryWhereUniqueInput
  }

  /**
   * AnalyticsSummary deleteMany
   */
  export type AnalyticsSummaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalyticsSummaries to delete
     */
    where?: AnalyticsSummaryWhereInput
    /**
     * Limit how many AnalyticsSummaries to delete.
     */
    limit?: number
  }

  /**
   * AnalyticsSummary without action
   */
  export type AnalyticsSummaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsSummary
     */
    select?: AnalyticsSummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsSummary
     */
    omit?: AnalyticsSummaryOmit<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    body: string | null
    type: string | null
    read: boolean | null
    link: string | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    body: string | null
    type: string | null
    read: boolean | null
    link: string | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    body: number
    type: number
    read: number
    link: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    read?: true
    link?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    read?: true
    link?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    read?: true
    link?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    body: string
    type: string
    read: boolean
    link: string | null
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    read?: boolean
    link?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    read?: boolean
    link?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "body" | "type" | "read" | "link" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      body: string
      type: string
      read: boolean
      link: string | null
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly link: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model PlatformSetting
   */

  export type AggregatePlatformSetting = {
    _count: PlatformSettingCountAggregateOutputType | null
    _min: PlatformSettingMinAggregateOutputType | null
    _max: PlatformSettingMaxAggregateOutputType | null
  }

  export type PlatformSettingMinAggregateOutputType = {
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type PlatformSettingMaxAggregateOutputType = {
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type PlatformSettingCountAggregateOutputType = {
    key: number
    value: number
    updatedAt: number
    _all: number
  }


  export type PlatformSettingMinAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
  }

  export type PlatformSettingMaxAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
  }

  export type PlatformSettingCountAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
    _all?: true
  }

  export type PlatformSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlatformSetting to aggregate.
     */
    where?: PlatformSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlatformSettings to fetch.
     */
    orderBy?: PlatformSettingOrderByWithRelationInput | PlatformSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlatformSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlatformSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlatformSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlatformSettings
    **/
    _count?: true | PlatformSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlatformSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlatformSettingMaxAggregateInputType
  }

  export type GetPlatformSettingAggregateType<T extends PlatformSettingAggregateArgs> = {
        [P in keyof T & keyof AggregatePlatformSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlatformSetting[P]>
      : GetScalarType<T[P], AggregatePlatformSetting[P]>
  }




  export type PlatformSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlatformSettingWhereInput
    orderBy?: PlatformSettingOrderByWithAggregationInput | PlatformSettingOrderByWithAggregationInput[]
    by: PlatformSettingScalarFieldEnum[] | PlatformSettingScalarFieldEnum
    having?: PlatformSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlatformSettingCountAggregateInputType | true
    _min?: PlatformSettingMinAggregateInputType
    _max?: PlatformSettingMaxAggregateInputType
  }

  export type PlatformSettingGroupByOutputType = {
    key: string
    value: string
    updatedAt: Date
    _count: PlatformSettingCountAggregateOutputType | null
    _min: PlatformSettingMinAggregateOutputType | null
    _max: PlatformSettingMaxAggregateOutputType | null
  }

  type GetPlatformSettingGroupByPayload<T extends PlatformSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlatformSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlatformSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlatformSettingGroupByOutputType[P]>
            : GetScalarType<T[P], PlatformSettingGroupByOutputType[P]>
        }
      >
    >


  export type PlatformSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["platformSetting"]>



  export type PlatformSettingSelectScalar = {
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }

  export type PlatformSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value" | "updatedAt", ExtArgs["result"]["platformSetting"]>

  export type $PlatformSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlatformSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string
      updatedAt: Date
    }, ExtArgs["result"]["platformSetting"]>
    composites: {}
  }

  type PlatformSettingGetPayload<S extends boolean | null | undefined | PlatformSettingDefaultArgs> = $Result.GetResult<Prisma.$PlatformSettingPayload, S>

  type PlatformSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlatformSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlatformSettingCountAggregateInputType | true
    }

  export interface PlatformSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlatformSetting'], meta: { name: 'PlatformSetting' } }
    /**
     * Find zero or one PlatformSetting that matches the filter.
     * @param {PlatformSettingFindUniqueArgs} args - Arguments to find a PlatformSetting
     * @example
     * // Get one PlatformSetting
     * const platformSetting = await prisma.platformSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlatformSettingFindUniqueArgs>(args: SelectSubset<T, PlatformSettingFindUniqueArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlatformSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlatformSettingFindUniqueOrThrowArgs} args - Arguments to find a PlatformSetting
     * @example
     * // Get one PlatformSetting
     * const platformSetting = await prisma.platformSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlatformSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, PlatformSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlatformSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingFindFirstArgs} args - Arguments to find a PlatformSetting
     * @example
     * // Get one PlatformSetting
     * const platformSetting = await prisma.platformSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlatformSettingFindFirstArgs>(args?: SelectSubset<T, PlatformSettingFindFirstArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlatformSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingFindFirstOrThrowArgs} args - Arguments to find a PlatformSetting
     * @example
     * // Get one PlatformSetting
     * const platformSetting = await prisma.platformSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlatformSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, PlatformSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlatformSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlatformSettings
     * const platformSettings = await prisma.platformSetting.findMany()
     * 
     * // Get first 10 PlatformSettings
     * const platformSettings = await prisma.platformSetting.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const platformSettingWithKeyOnly = await prisma.platformSetting.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends PlatformSettingFindManyArgs>(args?: SelectSubset<T, PlatformSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlatformSetting.
     * @param {PlatformSettingCreateArgs} args - Arguments to create a PlatformSetting.
     * @example
     * // Create one PlatformSetting
     * const PlatformSetting = await prisma.platformSetting.create({
     *   data: {
     *     // ... data to create a PlatformSetting
     *   }
     * })
     * 
     */
    create<T extends PlatformSettingCreateArgs>(args: SelectSubset<T, PlatformSettingCreateArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlatformSettings.
     * @param {PlatformSettingCreateManyArgs} args - Arguments to create many PlatformSettings.
     * @example
     * // Create many PlatformSettings
     * const platformSetting = await prisma.platformSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlatformSettingCreateManyArgs>(args?: SelectSubset<T, PlatformSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PlatformSetting.
     * @param {PlatformSettingDeleteArgs} args - Arguments to delete one PlatformSetting.
     * @example
     * // Delete one PlatformSetting
     * const PlatformSetting = await prisma.platformSetting.delete({
     *   where: {
     *     // ... filter to delete one PlatformSetting
     *   }
     * })
     * 
     */
    delete<T extends PlatformSettingDeleteArgs>(args: SelectSubset<T, PlatformSettingDeleteArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlatformSetting.
     * @param {PlatformSettingUpdateArgs} args - Arguments to update one PlatformSetting.
     * @example
     * // Update one PlatformSetting
     * const platformSetting = await prisma.platformSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlatformSettingUpdateArgs>(args: SelectSubset<T, PlatformSettingUpdateArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlatformSettings.
     * @param {PlatformSettingDeleteManyArgs} args - Arguments to filter PlatformSettings to delete.
     * @example
     * // Delete a few PlatformSettings
     * const { count } = await prisma.platformSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlatformSettingDeleteManyArgs>(args?: SelectSubset<T, PlatformSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlatformSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlatformSettings
     * const platformSetting = await prisma.platformSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlatformSettingUpdateManyArgs>(args: SelectSubset<T, PlatformSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PlatformSetting.
     * @param {PlatformSettingUpsertArgs} args - Arguments to update or create a PlatformSetting.
     * @example
     * // Update or create a PlatformSetting
     * const platformSetting = await prisma.platformSetting.upsert({
     *   create: {
     *     // ... data to create a PlatformSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlatformSetting we want to update
     *   }
     * })
     */
    upsert<T extends PlatformSettingUpsertArgs>(args: SelectSubset<T, PlatformSettingUpsertArgs<ExtArgs>>): Prisma__PlatformSettingClient<$Result.GetResult<Prisma.$PlatformSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlatformSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingCountArgs} args - Arguments to filter PlatformSettings to count.
     * @example
     * // Count the number of PlatformSettings
     * const count = await prisma.platformSetting.count({
     *   where: {
     *     // ... the filter for the PlatformSettings we want to count
     *   }
     * })
    **/
    count<T extends PlatformSettingCountArgs>(
      args?: Subset<T, PlatformSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlatformSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlatformSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlatformSettingAggregateArgs>(args: Subset<T, PlatformSettingAggregateArgs>): Prisma.PrismaPromise<GetPlatformSettingAggregateType<T>>

    /**
     * Group by PlatformSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlatformSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlatformSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlatformSettingGroupByArgs['orderBy'] }
        : { orderBy?: PlatformSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlatformSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlatformSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlatformSetting model
   */
  readonly fields: PlatformSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlatformSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlatformSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlatformSetting model
   */
  interface PlatformSettingFieldRefs {
    readonly key: FieldRef<"PlatformSetting", 'String'>
    readonly value: FieldRef<"PlatformSetting", 'String'>
    readonly updatedAt: FieldRef<"PlatformSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PlatformSetting findUnique
   */
  export type PlatformSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * Filter, which PlatformSetting to fetch.
     */
    where: PlatformSettingWhereUniqueInput
  }

  /**
   * PlatformSetting findUniqueOrThrow
   */
  export type PlatformSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * Filter, which PlatformSetting to fetch.
     */
    where: PlatformSettingWhereUniqueInput
  }

  /**
   * PlatformSetting findFirst
   */
  export type PlatformSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * Filter, which PlatformSetting to fetch.
     */
    where?: PlatformSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlatformSettings to fetch.
     */
    orderBy?: PlatformSettingOrderByWithRelationInput | PlatformSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlatformSettings.
     */
    cursor?: PlatformSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlatformSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlatformSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlatformSettings.
     */
    distinct?: PlatformSettingScalarFieldEnum | PlatformSettingScalarFieldEnum[]
  }

  /**
   * PlatformSetting findFirstOrThrow
   */
  export type PlatformSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * Filter, which PlatformSetting to fetch.
     */
    where?: PlatformSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlatformSettings to fetch.
     */
    orderBy?: PlatformSettingOrderByWithRelationInput | PlatformSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlatformSettings.
     */
    cursor?: PlatformSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlatformSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlatformSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlatformSettings.
     */
    distinct?: PlatformSettingScalarFieldEnum | PlatformSettingScalarFieldEnum[]
  }

  /**
   * PlatformSetting findMany
   */
  export type PlatformSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * Filter, which PlatformSettings to fetch.
     */
    where?: PlatformSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlatformSettings to fetch.
     */
    orderBy?: PlatformSettingOrderByWithRelationInput | PlatformSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlatformSettings.
     */
    cursor?: PlatformSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlatformSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlatformSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlatformSettings.
     */
    distinct?: PlatformSettingScalarFieldEnum | PlatformSettingScalarFieldEnum[]
  }

  /**
   * PlatformSetting create
   */
  export type PlatformSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a PlatformSetting.
     */
    data: XOR<PlatformSettingCreateInput, PlatformSettingUncheckedCreateInput>
  }

  /**
   * PlatformSetting createMany
   */
  export type PlatformSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlatformSettings.
     */
    data: PlatformSettingCreateManyInput | PlatformSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlatformSetting update
   */
  export type PlatformSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a PlatformSetting.
     */
    data: XOR<PlatformSettingUpdateInput, PlatformSettingUncheckedUpdateInput>
    /**
     * Choose, which PlatformSetting to update.
     */
    where: PlatformSettingWhereUniqueInput
  }

  /**
   * PlatformSetting updateMany
   */
  export type PlatformSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlatformSettings.
     */
    data: XOR<PlatformSettingUpdateManyMutationInput, PlatformSettingUncheckedUpdateManyInput>
    /**
     * Filter which PlatformSettings to update
     */
    where?: PlatformSettingWhereInput
    /**
     * Limit how many PlatformSettings to update.
     */
    limit?: number
  }

  /**
   * PlatformSetting upsert
   */
  export type PlatformSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the PlatformSetting to update in case it exists.
     */
    where: PlatformSettingWhereUniqueInput
    /**
     * In case the PlatformSetting found by the `where` argument doesn't exist, create a new PlatformSetting with this data.
     */
    create: XOR<PlatformSettingCreateInput, PlatformSettingUncheckedCreateInput>
    /**
     * In case the PlatformSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlatformSettingUpdateInput, PlatformSettingUncheckedUpdateInput>
  }

  /**
   * PlatformSetting delete
   */
  export type PlatformSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
    /**
     * Filter which PlatformSetting to delete.
     */
    where: PlatformSettingWhereUniqueInput
  }

  /**
   * PlatformSetting deleteMany
   */
  export type PlatformSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlatformSettings to delete
     */
    where?: PlatformSettingWhereInput
    /**
     * Limit how many PlatformSettings to delete.
     */
    limit?: number
  }

  /**
   * PlatformSetting without action
   */
  export type PlatformSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlatformSetting
     */
    select?: PlatformSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlatformSetting
     */
    omit?: PlatformSettingOmit<ExtArgs> | null
  }


  /**
   * Model GameWallet
   */

  export type AggregateGameWallet = {
    _count: GameWalletCountAggregateOutputType | null
    _avg: GameWalletAvgAggregateOutputType | null
    _sum: GameWalletSumAggregateOutputType | null
    _min: GameWalletMinAggregateOutputType | null
    _max: GameWalletMaxAggregateOutputType | null
  }

  export type GameWalletAvgAggregateOutputType = {
    balance: number | null
  }

  export type GameWalletSumAggregateOutputType = {
    balance: number | null
  }

  export type GameWalletMinAggregateOutputType = {
    id: string | null
    userId: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GameWalletMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GameWalletCountAggregateOutputType = {
    id: number
    userId: number
    balance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GameWalletAvgAggregateInputType = {
    balance?: true
  }

  export type GameWalletSumAggregateInputType = {
    balance?: true
  }

  export type GameWalletMinAggregateInputType = {
    id?: true
    userId?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GameWalletMaxAggregateInputType = {
    id?: true
    userId?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GameWalletCountAggregateInputType = {
    id?: true
    userId?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GameWalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameWallet to aggregate.
     */
    where?: GameWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWallets to fetch.
     */
    orderBy?: GameWalletOrderByWithRelationInput | GameWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameWallets
    **/
    _count?: true | GameWalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameWalletAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameWalletSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameWalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameWalletMaxAggregateInputType
  }

  export type GetGameWalletAggregateType<T extends GameWalletAggregateArgs> = {
        [P in keyof T & keyof AggregateGameWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameWallet[P]>
      : GetScalarType<T[P], AggregateGameWallet[P]>
  }




  export type GameWalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWalletWhereInput
    orderBy?: GameWalletOrderByWithAggregationInput | GameWalletOrderByWithAggregationInput[]
    by: GameWalletScalarFieldEnum[] | GameWalletScalarFieldEnum
    having?: GameWalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameWalletCountAggregateInputType | true
    _avg?: GameWalletAvgAggregateInputType
    _sum?: GameWalletSumAggregateInputType
    _min?: GameWalletMinAggregateInputType
    _max?: GameWalletMaxAggregateInputType
  }

  export type GameWalletGroupByOutputType = {
    id: string
    userId: string
    balance: number
    createdAt: Date
    updatedAt: Date
    _count: GameWalletCountAggregateOutputType | null
    _avg: GameWalletAvgAggregateOutputType | null
    _sum: GameWalletSumAggregateOutputType | null
    _min: GameWalletMinAggregateOutputType | null
    _max: GameWalletMaxAggregateOutputType | null
  }

  type GetGameWalletGroupByPayload<T extends GameWalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameWalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameWalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameWalletGroupByOutputType[P]>
            : GetScalarType<T[P], GameWalletGroupByOutputType[P]>
        }
      >
    >


  export type GameWalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    deposits?: boolean | GameWallet$depositsArgs<ExtArgs>
    sessions?: boolean | GameWallet$sessionsArgs<ExtArgs>
    withdrawals?: boolean | GameWallet$withdrawalsArgs<ExtArgs>
    _count?: boolean | GameWalletCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameWallet"]>



  export type GameWalletSelectScalar = {
    id?: boolean
    userId?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GameWalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "balance" | "createdAt" | "updatedAt", ExtArgs["result"]["gameWallet"]>
  export type GameWalletInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    deposits?: boolean | GameWallet$depositsArgs<ExtArgs>
    sessions?: boolean | GameWallet$sessionsArgs<ExtArgs>
    withdrawals?: boolean | GameWallet$withdrawalsArgs<ExtArgs>
    _count?: boolean | GameWalletCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $GameWalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameWallet"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      deposits: Prisma.$GameDepositPayload<ExtArgs>[]
      sessions: Prisma.$GameSessionPayload<ExtArgs>[]
      withdrawals: Prisma.$GameWithdrawalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      balance: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gameWallet"]>
    composites: {}
  }

  type GameWalletGetPayload<S extends boolean | null | undefined | GameWalletDefaultArgs> = $Result.GetResult<Prisma.$GameWalletPayload, S>

  type GameWalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameWalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameWalletCountAggregateInputType | true
    }

  export interface GameWalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameWallet'], meta: { name: 'GameWallet' } }
    /**
     * Find zero or one GameWallet that matches the filter.
     * @param {GameWalletFindUniqueArgs} args - Arguments to find a GameWallet
     * @example
     * // Get one GameWallet
     * const gameWallet = await prisma.gameWallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameWalletFindUniqueArgs>(args: SelectSubset<T, GameWalletFindUniqueArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameWallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameWalletFindUniqueOrThrowArgs} args - Arguments to find a GameWallet
     * @example
     * // Get one GameWallet
     * const gameWallet = await prisma.gameWallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameWalletFindUniqueOrThrowArgs>(args: SelectSubset<T, GameWalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameWallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletFindFirstArgs} args - Arguments to find a GameWallet
     * @example
     * // Get one GameWallet
     * const gameWallet = await prisma.gameWallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameWalletFindFirstArgs>(args?: SelectSubset<T, GameWalletFindFirstArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameWallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletFindFirstOrThrowArgs} args - Arguments to find a GameWallet
     * @example
     * // Get one GameWallet
     * const gameWallet = await prisma.gameWallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameWalletFindFirstOrThrowArgs>(args?: SelectSubset<T, GameWalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameWallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameWallets
     * const gameWallets = await prisma.gameWallet.findMany()
     * 
     * // Get first 10 GameWallets
     * const gameWallets = await prisma.gameWallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWalletWithIdOnly = await prisma.gameWallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameWalletFindManyArgs>(args?: SelectSubset<T, GameWalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameWallet.
     * @param {GameWalletCreateArgs} args - Arguments to create a GameWallet.
     * @example
     * // Create one GameWallet
     * const GameWallet = await prisma.gameWallet.create({
     *   data: {
     *     // ... data to create a GameWallet
     *   }
     * })
     * 
     */
    create<T extends GameWalletCreateArgs>(args: SelectSubset<T, GameWalletCreateArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameWallets.
     * @param {GameWalletCreateManyArgs} args - Arguments to create many GameWallets.
     * @example
     * // Create many GameWallets
     * const gameWallet = await prisma.gameWallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameWalletCreateManyArgs>(args?: SelectSubset<T, GameWalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GameWallet.
     * @param {GameWalletDeleteArgs} args - Arguments to delete one GameWallet.
     * @example
     * // Delete one GameWallet
     * const GameWallet = await prisma.gameWallet.delete({
     *   where: {
     *     // ... filter to delete one GameWallet
     *   }
     * })
     * 
     */
    delete<T extends GameWalletDeleteArgs>(args: SelectSubset<T, GameWalletDeleteArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameWallet.
     * @param {GameWalletUpdateArgs} args - Arguments to update one GameWallet.
     * @example
     * // Update one GameWallet
     * const gameWallet = await prisma.gameWallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameWalletUpdateArgs>(args: SelectSubset<T, GameWalletUpdateArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameWallets.
     * @param {GameWalletDeleteManyArgs} args - Arguments to filter GameWallets to delete.
     * @example
     * // Delete a few GameWallets
     * const { count } = await prisma.gameWallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameWalletDeleteManyArgs>(args?: SelectSubset<T, GameWalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameWallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameWallets
     * const gameWallet = await prisma.gameWallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameWalletUpdateManyArgs>(args: SelectSubset<T, GameWalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GameWallet.
     * @param {GameWalletUpsertArgs} args - Arguments to update or create a GameWallet.
     * @example
     * // Update or create a GameWallet
     * const gameWallet = await prisma.gameWallet.upsert({
     *   create: {
     *     // ... data to create a GameWallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameWallet we want to update
     *   }
     * })
     */
    upsert<T extends GameWalletUpsertArgs>(args: SelectSubset<T, GameWalletUpsertArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameWallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletCountArgs} args - Arguments to filter GameWallets to count.
     * @example
     * // Count the number of GameWallets
     * const count = await prisma.gameWallet.count({
     *   where: {
     *     // ... the filter for the GameWallets we want to count
     *   }
     * })
    **/
    count<T extends GameWalletCountArgs>(
      args?: Subset<T, GameWalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameWalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameWallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameWalletAggregateArgs>(args: Subset<T, GameWalletAggregateArgs>): Prisma.PrismaPromise<GetGameWalletAggregateType<T>>

    /**
     * Group by GameWallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameWalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameWalletGroupByArgs['orderBy'] }
        : { orderBy?: GameWalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameWalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameWallet model
   */
  readonly fields: GameWalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameWallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameWalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    deposits<T extends GameWallet$depositsArgs<ExtArgs> = {}>(args?: Subset<T, GameWallet$depositsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends GameWallet$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, GameWallet$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    withdrawals<T extends GameWallet$withdrawalsArgs<ExtArgs> = {}>(args?: Subset<T, GameWallet$withdrawalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameWallet model
   */
  interface GameWalletFieldRefs {
    readonly id: FieldRef<"GameWallet", 'String'>
    readonly userId: FieldRef<"GameWallet", 'String'>
    readonly balance: FieldRef<"GameWallet", 'Int'>
    readonly createdAt: FieldRef<"GameWallet", 'DateTime'>
    readonly updatedAt: FieldRef<"GameWallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameWallet findUnique
   */
  export type GameWalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * Filter, which GameWallet to fetch.
     */
    where: GameWalletWhereUniqueInput
  }

  /**
   * GameWallet findUniqueOrThrow
   */
  export type GameWalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * Filter, which GameWallet to fetch.
     */
    where: GameWalletWhereUniqueInput
  }

  /**
   * GameWallet findFirst
   */
  export type GameWalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * Filter, which GameWallet to fetch.
     */
    where?: GameWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWallets to fetch.
     */
    orderBy?: GameWalletOrderByWithRelationInput | GameWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameWallets.
     */
    cursor?: GameWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameWallets.
     */
    distinct?: GameWalletScalarFieldEnum | GameWalletScalarFieldEnum[]
  }

  /**
   * GameWallet findFirstOrThrow
   */
  export type GameWalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * Filter, which GameWallet to fetch.
     */
    where?: GameWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWallets to fetch.
     */
    orderBy?: GameWalletOrderByWithRelationInput | GameWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameWallets.
     */
    cursor?: GameWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameWallets.
     */
    distinct?: GameWalletScalarFieldEnum | GameWalletScalarFieldEnum[]
  }

  /**
   * GameWallet findMany
   */
  export type GameWalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * Filter, which GameWallets to fetch.
     */
    where?: GameWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWallets to fetch.
     */
    orderBy?: GameWalletOrderByWithRelationInput | GameWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameWallets.
     */
    cursor?: GameWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameWallets.
     */
    distinct?: GameWalletScalarFieldEnum | GameWalletScalarFieldEnum[]
  }

  /**
   * GameWallet create
   */
  export type GameWalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * The data needed to create a GameWallet.
     */
    data: XOR<GameWalletCreateInput, GameWalletUncheckedCreateInput>
  }

  /**
   * GameWallet createMany
   */
  export type GameWalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameWallets.
     */
    data: GameWalletCreateManyInput | GameWalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameWallet update
   */
  export type GameWalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * The data needed to update a GameWallet.
     */
    data: XOR<GameWalletUpdateInput, GameWalletUncheckedUpdateInput>
    /**
     * Choose, which GameWallet to update.
     */
    where: GameWalletWhereUniqueInput
  }

  /**
   * GameWallet updateMany
   */
  export type GameWalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameWallets.
     */
    data: XOR<GameWalletUpdateManyMutationInput, GameWalletUncheckedUpdateManyInput>
    /**
     * Filter which GameWallets to update
     */
    where?: GameWalletWhereInput
    /**
     * Limit how many GameWallets to update.
     */
    limit?: number
  }

  /**
   * GameWallet upsert
   */
  export type GameWalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * The filter to search for the GameWallet to update in case it exists.
     */
    where: GameWalletWhereUniqueInput
    /**
     * In case the GameWallet found by the `where` argument doesn't exist, create a new GameWallet with this data.
     */
    create: XOR<GameWalletCreateInput, GameWalletUncheckedCreateInput>
    /**
     * In case the GameWallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameWalletUpdateInput, GameWalletUncheckedUpdateInput>
  }

  /**
   * GameWallet delete
   */
  export type GameWalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
    /**
     * Filter which GameWallet to delete.
     */
    where: GameWalletWhereUniqueInput
  }

  /**
   * GameWallet deleteMany
   */
  export type GameWalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameWallets to delete
     */
    where?: GameWalletWhereInput
    /**
     * Limit how many GameWallets to delete.
     */
    limit?: number
  }

  /**
   * GameWallet.deposits
   */
  export type GameWallet$depositsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    where?: GameDepositWhereInput
    orderBy?: GameDepositOrderByWithRelationInput | GameDepositOrderByWithRelationInput[]
    cursor?: GameDepositWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameDepositScalarFieldEnum | GameDepositScalarFieldEnum[]
  }

  /**
   * GameWallet.sessions
   */
  export type GameWallet$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    where?: GameSessionWhereInput
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    cursor?: GameSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameWallet.withdrawals
   */
  export type GameWallet$withdrawalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    where?: GameWithdrawalWhereInput
    orderBy?: GameWithdrawalOrderByWithRelationInput | GameWithdrawalOrderByWithRelationInput[]
    cursor?: GameWithdrawalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameWithdrawalScalarFieldEnum | GameWithdrawalScalarFieldEnum[]
  }

  /**
   * GameWallet without action
   */
  export type GameWalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWallet
     */
    select?: GameWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWallet
     */
    omit?: GameWalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWalletInclude<ExtArgs> | null
  }


  /**
   * Model GameDeposit
   */

  export type AggregateGameDeposit = {
    _count: GameDepositCountAggregateOutputType | null
    _avg: GameDepositAvgAggregateOutputType | null
    _sum: GameDepositSumAggregateOutputType | null
    _min: GameDepositMinAggregateOutputType | null
    _max: GameDepositMaxAggregateOutputType | null
  }

  export type GameDepositAvgAggregateOutputType = {
    amount: number | null
  }

  export type GameDepositSumAggregateOutputType = {
    amount: number | null
  }

  export type GameDepositMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    userId: string | null
    amount: number | null
    method: $Enums.PaymentMethod | null
    screenshotUrl: string | null
    status: $Enums.GameDepositStatus | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type GameDepositMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    userId: string | null
    amount: number | null
    method: $Enums.PaymentMethod | null
    screenshotUrl: string | null
    status: $Enums.GameDepositStatus | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type GameDepositCountAggregateOutputType = {
    id: number
    walletId: number
    userId: number
    amount: number
    method: number
    screenshotUrl: number
    status: number
    rejectionReason: number
    submittedAt: number
    reviewedAt: number
    reviewedBy: number
    _all: number
  }


  export type GameDepositAvgAggregateInputType = {
    amount?: true
  }

  export type GameDepositSumAggregateInputType = {
    amount?: true
  }

  export type GameDepositMinAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    amount?: true
    method?: true
    screenshotUrl?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type GameDepositMaxAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    amount?: true
    method?: true
    screenshotUrl?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type GameDepositCountAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    amount?: true
    method?: true
    screenshotUrl?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    _all?: true
  }

  export type GameDepositAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameDeposit to aggregate.
     */
    where?: GameDepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameDeposits to fetch.
     */
    orderBy?: GameDepositOrderByWithRelationInput | GameDepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameDepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameDeposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameDeposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameDeposits
    **/
    _count?: true | GameDepositCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameDepositAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameDepositSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameDepositMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameDepositMaxAggregateInputType
  }

  export type GetGameDepositAggregateType<T extends GameDepositAggregateArgs> = {
        [P in keyof T & keyof AggregateGameDeposit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameDeposit[P]>
      : GetScalarType<T[P], AggregateGameDeposit[P]>
  }




  export type GameDepositGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameDepositWhereInput
    orderBy?: GameDepositOrderByWithAggregationInput | GameDepositOrderByWithAggregationInput[]
    by: GameDepositScalarFieldEnum[] | GameDepositScalarFieldEnum
    having?: GameDepositScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameDepositCountAggregateInputType | true
    _avg?: GameDepositAvgAggregateInputType
    _sum?: GameDepositSumAggregateInputType
    _min?: GameDepositMinAggregateInputType
    _max?: GameDepositMaxAggregateInputType
  }

  export type GameDepositGroupByOutputType = {
    id: string
    walletId: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status: $Enums.GameDepositStatus
    rejectionReason: string | null
    submittedAt: Date
    reviewedAt: Date | null
    reviewedBy: string | null
    _count: GameDepositCountAggregateOutputType | null
    _avg: GameDepositAvgAggregateOutputType | null
    _sum: GameDepositSumAggregateOutputType | null
    _min: GameDepositMinAggregateOutputType | null
    _max: GameDepositMaxAggregateOutputType | null
  }

  type GetGameDepositGroupByPayload<T extends GameDepositGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameDepositGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameDepositGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameDepositGroupByOutputType[P]>
            : GetScalarType<T[P], GameDepositGroupByOutputType[P]>
        }
      >
    >


  export type GameDepositSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    userId?: boolean
    amount?: boolean
    method?: boolean
    screenshotUrl?: boolean
    status?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    wallet?: boolean | GameWalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameDeposit"]>



  export type GameDepositSelectScalar = {
    id?: boolean
    walletId?: boolean
    userId?: boolean
    amount?: boolean
    method?: boolean
    screenshotUrl?: boolean
    status?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
  }

  export type GameDepositOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "userId" | "amount" | "method" | "screenshotUrl" | "status" | "rejectionReason" | "submittedAt" | "reviewedAt" | "reviewedBy", ExtArgs["result"]["gameDeposit"]>
  export type GameDepositInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | GameWalletDefaultArgs<ExtArgs>
  }

  export type $GameDepositPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameDeposit"
    objects: {
      wallet: Prisma.$GameWalletPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      userId: string
      amount: number
      method: $Enums.PaymentMethod
      screenshotUrl: string
      status: $Enums.GameDepositStatus
      rejectionReason: string | null
      submittedAt: Date
      reviewedAt: Date | null
      reviewedBy: string | null
    }, ExtArgs["result"]["gameDeposit"]>
    composites: {}
  }

  type GameDepositGetPayload<S extends boolean | null | undefined | GameDepositDefaultArgs> = $Result.GetResult<Prisma.$GameDepositPayload, S>

  type GameDepositCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameDepositFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameDepositCountAggregateInputType | true
    }

  export interface GameDepositDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameDeposit'], meta: { name: 'GameDeposit' } }
    /**
     * Find zero or one GameDeposit that matches the filter.
     * @param {GameDepositFindUniqueArgs} args - Arguments to find a GameDeposit
     * @example
     * // Get one GameDeposit
     * const gameDeposit = await prisma.gameDeposit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameDepositFindUniqueArgs>(args: SelectSubset<T, GameDepositFindUniqueArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameDeposit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameDepositFindUniqueOrThrowArgs} args - Arguments to find a GameDeposit
     * @example
     * // Get one GameDeposit
     * const gameDeposit = await prisma.gameDeposit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameDepositFindUniqueOrThrowArgs>(args: SelectSubset<T, GameDepositFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameDeposit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositFindFirstArgs} args - Arguments to find a GameDeposit
     * @example
     * // Get one GameDeposit
     * const gameDeposit = await prisma.gameDeposit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameDepositFindFirstArgs>(args?: SelectSubset<T, GameDepositFindFirstArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameDeposit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositFindFirstOrThrowArgs} args - Arguments to find a GameDeposit
     * @example
     * // Get one GameDeposit
     * const gameDeposit = await prisma.gameDeposit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameDepositFindFirstOrThrowArgs>(args?: SelectSubset<T, GameDepositFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameDeposits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameDeposits
     * const gameDeposits = await prisma.gameDeposit.findMany()
     * 
     * // Get first 10 GameDeposits
     * const gameDeposits = await prisma.gameDeposit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameDepositWithIdOnly = await prisma.gameDeposit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameDepositFindManyArgs>(args?: SelectSubset<T, GameDepositFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameDeposit.
     * @param {GameDepositCreateArgs} args - Arguments to create a GameDeposit.
     * @example
     * // Create one GameDeposit
     * const GameDeposit = await prisma.gameDeposit.create({
     *   data: {
     *     // ... data to create a GameDeposit
     *   }
     * })
     * 
     */
    create<T extends GameDepositCreateArgs>(args: SelectSubset<T, GameDepositCreateArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameDeposits.
     * @param {GameDepositCreateManyArgs} args - Arguments to create many GameDeposits.
     * @example
     * // Create many GameDeposits
     * const gameDeposit = await prisma.gameDeposit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameDepositCreateManyArgs>(args?: SelectSubset<T, GameDepositCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GameDeposit.
     * @param {GameDepositDeleteArgs} args - Arguments to delete one GameDeposit.
     * @example
     * // Delete one GameDeposit
     * const GameDeposit = await prisma.gameDeposit.delete({
     *   where: {
     *     // ... filter to delete one GameDeposit
     *   }
     * })
     * 
     */
    delete<T extends GameDepositDeleteArgs>(args: SelectSubset<T, GameDepositDeleteArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameDeposit.
     * @param {GameDepositUpdateArgs} args - Arguments to update one GameDeposit.
     * @example
     * // Update one GameDeposit
     * const gameDeposit = await prisma.gameDeposit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameDepositUpdateArgs>(args: SelectSubset<T, GameDepositUpdateArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameDeposits.
     * @param {GameDepositDeleteManyArgs} args - Arguments to filter GameDeposits to delete.
     * @example
     * // Delete a few GameDeposits
     * const { count } = await prisma.gameDeposit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameDepositDeleteManyArgs>(args?: SelectSubset<T, GameDepositDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameDeposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameDeposits
     * const gameDeposit = await prisma.gameDeposit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameDepositUpdateManyArgs>(args: SelectSubset<T, GameDepositUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GameDeposit.
     * @param {GameDepositUpsertArgs} args - Arguments to update or create a GameDeposit.
     * @example
     * // Update or create a GameDeposit
     * const gameDeposit = await prisma.gameDeposit.upsert({
     *   create: {
     *     // ... data to create a GameDeposit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameDeposit we want to update
     *   }
     * })
     */
    upsert<T extends GameDepositUpsertArgs>(args: SelectSubset<T, GameDepositUpsertArgs<ExtArgs>>): Prisma__GameDepositClient<$Result.GetResult<Prisma.$GameDepositPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameDeposits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositCountArgs} args - Arguments to filter GameDeposits to count.
     * @example
     * // Count the number of GameDeposits
     * const count = await prisma.gameDeposit.count({
     *   where: {
     *     // ... the filter for the GameDeposits we want to count
     *   }
     * })
    **/
    count<T extends GameDepositCountArgs>(
      args?: Subset<T, GameDepositCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameDepositCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameDeposit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameDepositAggregateArgs>(args: Subset<T, GameDepositAggregateArgs>): Prisma.PrismaPromise<GetGameDepositAggregateType<T>>

    /**
     * Group by GameDeposit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameDepositGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameDepositGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameDepositGroupByArgs['orderBy'] }
        : { orderBy?: GameDepositGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameDepositGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameDepositGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameDeposit model
   */
  readonly fields: GameDepositFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameDeposit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameDepositClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends GameWalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameWalletDefaultArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameDeposit model
   */
  interface GameDepositFieldRefs {
    readonly id: FieldRef<"GameDeposit", 'String'>
    readonly walletId: FieldRef<"GameDeposit", 'String'>
    readonly userId: FieldRef<"GameDeposit", 'String'>
    readonly amount: FieldRef<"GameDeposit", 'Int'>
    readonly method: FieldRef<"GameDeposit", 'PaymentMethod'>
    readonly screenshotUrl: FieldRef<"GameDeposit", 'String'>
    readonly status: FieldRef<"GameDeposit", 'GameDepositStatus'>
    readonly rejectionReason: FieldRef<"GameDeposit", 'String'>
    readonly submittedAt: FieldRef<"GameDeposit", 'DateTime'>
    readonly reviewedAt: FieldRef<"GameDeposit", 'DateTime'>
    readonly reviewedBy: FieldRef<"GameDeposit", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GameDeposit findUnique
   */
  export type GameDepositFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * Filter, which GameDeposit to fetch.
     */
    where: GameDepositWhereUniqueInput
  }

  /**
   * GameDeposit findUniqueOrThrow
   */
  export type GameDepositFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * Filter, which GameDeposit to fetch.
     */
    where: GameDepositWhereUniqueInput
  }

  /**
   * GameDeposit findFirst
   */
  export type GameDepositFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * Filter, which GameDeposit to fetch.
     */
    where?: GameDepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameDeposits to fetch.
     */
    orderBy?: GameDepositOrderByWithRelationInput | GameDepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameDeposits.
     */
    cursor?: GameDepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameDeposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameDeposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameDeposits.
     */
    distinct?: GameDepositScalarFieldEnum | GameDepositScalarFieldEnum[]
  }

  /**
   * GameDeposit findFirstOrThrow
   */
  export type GameDepositFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * Filter, which GameDeposit to fetch.
     */
    where?: GameDepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameDeposits to fetch.
     */
    orderBy?: GameDepositOrderByWithRelationInput | GameDepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameDeposits.
     */
    cursor?: GameDepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameDeposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameDeposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameDeposits.
     */
    distinct?: GameDepositScalarFieldEnum | GameDepositScalarFieldEnum[]
  }

  /**
   * GameDeposit findMany
   */
  export type GameDepositFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * Filter, which GameDeposits to fetch.
     */
    where?: GameDepositWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameDeposits to fetch.
     */
    orderBy?: GameDepositOrderByWithRelationInput | GameDepositOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameDeposits.
     */
    cursor?: GameDepositWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameDeposits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameDeposits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameDeposits.
     */
    distinct?: GameDepositScalarFieldEnum | GameDepositScalarFieldEnum[]
  }

  /**
   * GameDeposit create
   */
  export type GameDepositCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * The data needed to create a GameDeposit.
     */
    data: XOR<GameDepositCreateInput, GameDepositUncheckedCreateInput>
  }

  /**
   * GameDeposit createMany
   */
  export type GameDepositCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameDeposits.
     */
    data: GameDepositCreateManyInput | GameDepositCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameDeposit update
   */
  export type GameDepositUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * The data needed to update a GameDeposit.
     */
    data: XOR<GameDepositUpdateInput, GameDepositUncheckedUpdateInput>
    /**
     * Choose, which GameDeposit to update.
     */
    where: GameDepositWhereUniqueInput
  }

  /**
   * GameDeposit updateMany
   */
  export type GameDepositUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameDeposits.
     */
    data: XOR<GameDepositUpdateManyMutationInput, GameDepositUncheckedUpdateManyInput>
    /**
     * Filter which GameDeposits to update
     */
    where?: GameDepositWhereInput
    /**
     * Limit how many GameDeposits to update.
     */
    limit?: number
  }

  /**
   * GameDeposit upsert
   */
  export type GameDepositUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * The filter to search for the GameDeposit to update in case it exists.
     */
    where: GameDepositWhereUniqueInput
    /**
     * In case the GameDeposit found by the `where` argument doesn't exist, create a new GameDeposit with this data.
     */
    create: XOR<GameDepositCreateInput, GameDepositUncheckedCreateInput>
    /**
     * In case the GameDeposit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameDepositUpdateInput, GameDepositUncheckedUpdateInput>
  }

  /**
   * GameDeposit delete
   */
  export type GameDepositDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
    /**
     * Filter which GameDeposit to delete.
     */
    where: GameDepositWhereUniqueInput
  }

  /**
   * GameDeposit deleteMany
   */
  export type GameDepositDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameDeposits to delete
     */
    where?: GameDepositWhereInput
    /**
     * Limit how many GameDeposits to delete.
     */
    limit?: number
  }

  /**
   * GameDeposit without action
   */
  export type GameDepositDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameDeposit
     */
    select?: GameDepositSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameDeposit
     */
    omit?: GameDepositOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameDepositInclude<ExtArgs> | null
  }


  /**
   * Model GameSession
   */

  export type AggregateGameSession = {
    _count: GameSessionCountAggregateOutputType | null
    _avg: GameSessionAvgAggregateOutputType | null
    _sum: GameSessionSumAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  export type GameSessionAvgAggregateOutputType = {
    wagerAmount: number | null
    finalScore: number | null
    winAmount: number | null
  }

  export type GameSessionSumAggregateOutputType = {
    wagerAmount: number | null
    finalScore: number | null
    winAmount: number | null
  }

  export type GameSessionMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    userId: string | null
    wagerAmount: number | null
    finalScore: number | null
    winAmount: number | null
    startedAt: Date | null
    endedAt: Date | null
    completed: boolean | null
  }

  export type GameSessionMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    userId: string | null
    wagerAmount: number | null
    finalScore: number | null
    winAmount: number | null
    startedAt: Date | null
    endedAt: Date | null
    completed: boolean | null
  }

  export type GameSessionCountAggregateOutputType = {
    id: number
    walletId: number
    userId: number
    wagerAmount: number
    finalScore: number
    winAmount: number
    milestones: number
    startedAt: number
    endedAt: number
    completed: number
    _all: number
  }


  export type GameSessionAvgAggregateInputType = {
    wagerAmount?: true
    finalScore?: true
    winAmount?: true
  }

  export type GameSessionSumAggregateInputType = {
    wagerAmount?: true
    finalScore?: true
    winAmount?: true
  }

  export type GameSessionMinAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    wagerAmount?: true
    finalScore?: true
    winAmount?: true
    startedAt?: true
    endedAt?: true
    completed?: true
  }

  export type GameSessionMaxAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    wagerAmount?: true
    finalScore?: true
    winAmount?: true
    startedAt?: true
    endedAt?: true
    completed?: true
  }

  export type GameSessionCountAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    wagerAmount?: true
    finalScore?: true
    winAmount?: true
    milestones?: true
    startedAt?: true
    endedAt?: true
    completed?: true
    _all?: true
  }

  export type GameSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSession to aggregate.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameSessions
    **/
    _count?: true | GameSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameSessionMaxAggregateInputType
  }

  export type GetGameSessionAggregateType<T extends GameSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateGameSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameSession[P]>
      : GetScalarType<T[P], AggregateGameSession[P]>
  }




  export type GameSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionWhereInput
    orderBy?: GameSessionOrderByWithAggregationInput | GameSessionOrderByWithAggregationInput[]
    by: GameSessionScalarFieldEnum[] | GameSessionScalarFieldEnum
    having?: GameSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameSessionCountAggregateInputType | true
    _avg?: GameSessionAvgAggregateInputType
    _sum?: GameSessionSumAggregateInputType
    _min?: GameSessionMinAggregateInputType
    _max?: GameSessionMaxAggregateInputType
  }

  export type GameSessionGroupByOutputType = {
    id: string
    walletId: string
    userId: string
    wagerAmount: number
    finalScore: number
    winAmount: number
    milestones: JsonValue
    startedAt: Date
    endedAt: Date | null
    completed: boolean
    _count: GameSessionCountAggregateOutputType | null
    _avg: GameSessionAvgAggregateOutputType | null
    _sum: GameSessionSumAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  type GetGameSessionGroupByPayload<T extends GameSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
            : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
        }
      >
    >


  export type GameSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    userId?: boolean
    wagerAmount?: boolean
    finalScore?: boolean
    winAmount?: boolean
    milestones?: boolean
    startedAt?: boolean
    endedAt?: boolean
    completed?: boolean
    wallet?: boolean | GameWalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameSession"]>



  export type GameSessionSelectScalar = {
    id?: boolean
    walletId?: boolean
    userId?: boolean
    wagerAmount?: boolean
    finalScore?: boolean
    winAmount?: boolean
    milestones?: boolean
    startedAt?: boolean
    endedAt?: boolean
    completed?: boolean
  }

  export type GameSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "userId" | "wagerAmount" | "finalScore" | "winAmount" | "milestones" | "startedAt" | "endedAt" | "completed", ExtArgs["result"]["gameSession"]>
  export type GameSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | GameWalletDefaultArgs<ExtArgs>
  }

  export type $GameSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameSession"
    objects: {
      wallet: Prisma.$GameWalletPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      userId: string
      wagerAmount: number
      finalScore: number
      winAmount: number
      milestones: Prisma.JsonValue
      startedAt: Date
      endedAt: Date | null
      completed: boolean
    }, ExtArgs["result"]["gameSession"]>
    composites: {}
  }

  type GameSessionGetPayload<S extends boolean | null | undefined | GameSessionDefaultArgs> = $Result.GetResult<Prisma.$GameSessionPayload, S>

  type GameSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameSessionCountAggregateInputType | true
    }

  export interface GameSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameSession'], meta: { name: 'GameSession' } }
    /**
     * Find zero or one GameSession that matches the filter.
     * @param {GameSessionFindUniqueArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameSessionFindUniqueArgs>(args: SelectSubset<T, GameSessionFindUniqueArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameSessionFindUniqueOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, GameSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameSessionFindFirstArgs>(args?: SelectSubset<T, GameSessionFindFirstArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, GameSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameSessions
     * const gameSessions = await prisma.gameSession.findMany()
     * 
     * // Get first 10 GameSessions
     * const gameSessions = await prisma.gameSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameSessionFindManyArgs>(args?: SelectSubset<T, GameSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameSession.
     * @param {GameSessionCreateArgs} args - Arguments to create a GameSession.
     * @example
     * // Create one GameSession
     * const GameSession = await prisma.gameSession.create({
     *   data: {
     *     // ... data to create a GameSession
     *   }
     * })
     * 
     */
    create<T extends GameSessionCreateArgs>(args: SelectSubset<T, GameSessionCreateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameSessions.
     * @param {GameSessionCreateManyArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameSessionCreateManyArgs>(args?: SelectSubset<T, GameSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GameSession.
     * @param {GameSessionDeleteArgs} args - Arguments to delete one GameSession.
     * @example
     * // Delete one GameSession
     * const GameSession = await prisma.gameSession.delete({
     *   where: {
     *     // ... filter to delete one GameSession
     *   }
     * })
     * 
     */
    delete<T extends GameSessionDeleteArgs>(args: SelectSubset<T, GameSessionDeleteArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameSession.
     * @param {GameSessionUpdateArgs} args - Arguments to update one GameSession.
     * @example
     * // Update one GameSession
     * const gameSession = await prisma.gameSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameSessionUpdateArgs>(args: SelectSubset<T, GameSessionUpdateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameSessions.
     * @param {GameSessionDeleteManyArgs} args - Arguments to filter GameSessions to delete.
     * @example
     * // Delete a few GameSessions
     * const { count } = await prisma.gameSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameSessionDeleteManyArgs>(args?: SelectSubset<T, GameSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameSessionUpdateManyArgs>(args: SelectSubset<T, GameSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GameSession.
     * @param {GameSessionUpsertArgs} args - Arguments to update or create a GameSession.
     * @example
     * // Update or create a GameSession
     * const gameSession = await prisma.gameSession.upsert({
     *   create: {
     *     // ... data to create a GameSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameSession we want to update
     *   }
     * })
     */
    upsert<T extends GameSessionUpsertArgs>(args: SelectSubset<T, GameSessionUpsertArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionCountArgs} args - Arguments to filter GameSessions to count.
     * @example
     * // Count the number of GameSessions
     * const count = await prisma.gameSession.count({
     *   where: {
     *     // ... the filter for the GameSessions we want to count
     *   }
     * })
    **/
    count<T extends GameSessionCountArgs>(
      args?: Subset<T, GameSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameSessionAggregateArgs>(args: Subset<T, GameSessionAggregateArgs>): Prisma.PrismaPromise<GetGameSessionAggregateType<T>>

    /**
     * Group by GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameSessionGroupByArgs['orderBy'] }
        : { orderBy?: GameSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameSession model
   */
  readonly fields: GameSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends GameWalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameWalletDefaultArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameSession model
   */
  interface GameSessionFieldRefs {
    readonly id: FieldRef<"GameSession", 'String'>
    readonly walletId: FieldRef<"GameSession", 'String'>
    readonly userId: FieldRef<"GameSession", 'String'>
    readonly wagerAmount: FieldRef<"GameSession", 'Int'>
    readonly finalScore: FieldRef<"GameSession", 'Int'>
    readonly winAmount: FieldRef<"GameSession", 'Int'>
    readonly milestones: FieldRef<"GameSession", 'Json'>
    readonly startedAt: FieldRef<"GameSession", 'DateTime'>
    readonly endedAt: FieldRef<"GameSession", 'DateTime'>
    readonly completed: FieldRef<"GameSession", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * GameSession findUnique
   */
  export type GameSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findUniqueOrThrow
   */
  export type GameSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findFirst
   */
  export type GameSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findFirstOrThrow
   */
  export type GameSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findMany
   */
  export type GameSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessions to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession create
   */
  export type GameSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a GameSession.
     */
    data: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
  }

  /**
   * GameSession createMany
   */
  export type GameSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession update
   */
  export type GameSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a GameSession.
     */
    data: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
    /**
     * Choose, which GameSession to update.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession updateMany
   */
  export type GameSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession upsert
   */
  export type GameSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the GameSession to update in case it exists.
     */
    where: GameSessionWhereUniqueInput
    /**
     * In case the GameSession found by the `where` argument doesn't exist, create a new GameSession with this data.
     */
    create: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
    /**
     * In case the GameSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
  }

  /**
   * GameSession delete
   */
  export type GameSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter which GameSession to delete.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession deleteMany
   */
  export type GameSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSessions to delete
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to delete.
     */
    limit?: number
  }

  /**
   * GameSession without action
   */
  export type GameSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
  }


  /**
   * Model GameWithdrawal
   */

  export type AggregateGameWithdrawal = {
    _count: GameWithdrawalCountAggregateOutputType | null
    _avg: GameWithdrawalAvgAggregateOutputType | null
    _sum: GameWithdrawalSumAggregateOutputType | null
    _min: GameWithdrawalMinAggregateOutputType | null
    _max: GameWithdrawalMaxAggregateOutputType | null
  }

  export type GameWithdrawalAvgAggregateOutputType = {
    amount: number | null
  }

  export type GameWithdrawalSumAggregateOutputType = {
    amount: number | null
  }

  export type GameWithdrawalMinAggregateOutputType = {
    id: string | null
    walletId: string | null
    userId: string | null
    amount: number | null
    method: string | null
    accountNumber: string | null
    accountName: string | null
    status: $Enums.GameWithdrawalStatus | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type GameWithdrawalMaxAggregateOutputType = {
    id: string | null
    walletId: string | null
    userId: string | null
    amount: number | null
    method: string | null
    accountNumber: string | null
    accountName: string | null
    status: $Enums.GameWithdrawalStatus | null
    rejectionReason: string | null
    submittedAt: Date | null
    reviewedAt: Date | null
    reviewedBy: string | null
  }

  export type GameWithdrawalCountAggregateOutputType = {
    id: number
    walletId: number
    userId: number
    amount: number
    method: number
    accountNumber: number
    accountName: number
    status: number
    rejectionReason: number
    submittedAt: number
    reviewedAt: number
    reviewedBy: number
    _all: number
  }


  export type GameWithdrawalAvgAggregateInputType = {
    amount?: true
  }

  export type GameWithdrawalSumAggregateInputType = {
    amount?: true
  }

  export type GameWithdrawalMinAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    amount?: true
    method?: true
    accountNumber?: true
    accountName?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type GameWithdrawalMaxAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    amount?: true
    method?: true
    accountNumber?: true
    accountName?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
  }

  export type GameWithdrawalCountAggregateInputType = {
    id?: true
    walletId?: true
    userId?: true
    amount?: true
    method?: true
    accountNumber?: true
    accountName?: true
    status?: true
    rejectionReason?: true
    submittedAt?: true
    reviewedAt?: true
    reviewedBy?: true
    _all?: true
  }

  export type GameWithdrawalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameWithdrawal to aggregate.
     */
    where?: GameWithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWithdrawals to fetch.
     */
    orderBy?: GameWithdrawalOrderByWithRelationInput | GameWithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWithdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWithdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameWithdrawals
    **/
    _count?: true | GameWithdrawalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameWithdrawalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameWithdrawalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameWithdrawalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameWithdrawalMaxAggregateInputType
  }

  export type GetGameWithdrawalAggregateType<T extends GameWithdrawalAggregateArgs> = {
        [P in keyof T & keyof AggregateGameWithdrawal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameWithdrawal[P]>
      : GetScalarType<T[P], AggregateGameWithdrawal[P]>
  }




  export type GameWithdrawalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWithdrawalWhereInput
    orderBy?: GameWithdrawalOrderByWithAggregationInput | GameWithdrawalOrderByWithAggregationInput[]
    by: GameWithdrawalScalarFieldEnum[] | GameWithdrawalScalarFieldEnum
    having?: GameWithdrawalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameWithdrawalCountAggregateInputType | true
    _avg?: GameWithdrawalAvgAggregateInputType
    _sum?: GameWithdrawalSumAggregateInputType
    _min?: GameWithdrawalMinAggregateInputType
    _max?: GameWithdrawalMaxAggregateInputType
  }

  export type GameWithdrawalGroupByOutputType = {
    id: string
    walletId: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status: $Enums.GameWithdrawalStatus
    rejectionReason: string | null
    submittedAt: Date
    reviewedAt: Date | null
    reviewedBy: string | null
    _count: GameWithdrawalCountAggregateOutputType | null
    _avg: GameWithdrawalAvgAggregateOutputType | null
    _sum: GameWithdrawalSumAggregateOutputType | null
    _min: GameWithdrawalMinAggregateOutputType | null
    _max: GameWithdrawalMaxAggregateOutputType | null
  }

  type GetGameWithdrawalGroupByPayload<T extends GameWithdrawalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameWithdrawalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameWithdrawalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameWithdrawalGroupByOutputType[P]>
            : GetScalarType<T[P], GameWithdrawalGroupByOutputType[P]>
        }
      >
    >


  export type GameWithdrawalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    walletId?: boolean
    userId?: boolean
    amount?: boolean
    method?: boolean
    accountNumber?: boolean
    accountName?: boolean
    status?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    wallet?: boolean | GameWalletDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameWithdrawal"]>



  export type GameWithdrawalSelectScalar = {
    id?: boolean
    walletId?: boolean
    userId?: boolean
    amount?: boolean
    method?: boolean
    accountNumber?: boolean
    accountName?: boolean
    status?: boolean
    rejectionReason?: boolean
    submittedAt?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
  }

  export type GameWithdrawalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "walletId" | "userId" | "amount" | "method" | "accountNumber" | "accountName" | "status" | "rejectionReason" | "submittedAt" | "reviewedAt" | "reviewedBy", ExtArgs["result"]["gameWithdrawal"]>
  export type GameWithdrawalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wallet?: boolean | GameWalletDefaultArgs<ExtArgs>
  }

  export type $GameWithdrawalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameWithdrawal"
    objects: {
      wallet: Prisma.$GameWalletPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      walletId: string
      userId: string
      amount: number
      method: string
      accountNumber: string
      accountName: string
      status: $Enums.GameWithdrawalStatus
      rejectionReason: string | null
      submittedAt: Date
      reviewedAt: Date | null
      reviewedBy: string | null
    }, ExtArgs["result"]["gameWithdrawal"]>
    composites: {}
  }

  type GameWithdrawalGetPayload<S extends boolean | null | undefined | GameWithdrawalDefaultArgs> = $Result.GetResult<Prisma.$GameWithdrawalPayload, S>

  type GameWithdrawalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameWithdrawalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameWithdrawalCountAggregateInputType | true
    }

  export interface GameWithdrawalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameWithdrawal'], meta: { name: 'GameWithdrawal' } }
    /**
     * Find zero or one GameWithdrawal that matches the filter.
     * @param {GameWithdrawalFindUniqueArgs} args - Arguments to find a GameWithdrawal
     * @example
     * // Get one GameWithdrawal
     * const gameWithdrawal = await prisma.gameWithdrawal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameWithdrawalFindUniqueArgs>(args: SelectSubset<T, GameWithdrawalFindUniqueArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameWithdrawal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameWithdrawalFindUniqueOrThrowArgs} args - Arguments to find a GameWithdrawal
     * @example
     * // Get one GameWithdrawal
     * const gameWithdrawal = await prisma.gameWithdrawal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameWithdrawalFindUniqueOrThrowArgs>(args: SelectSubset<T, GameWithdrawalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameWithdrawal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalFindFirstArgs} args - Arguments to find a GameWithdrawal
     * @example
     * // Get one GameWithdrawal
     * const gameWithdrawal = await prisma.gameWithdrawal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameWithdrawalFindFirstArgs>(args?: SelectSubset<T, GameWithdrawalFindFirstArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameWithdrawal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalFindFirstOrThrowArgs} args - Arguments to find a GameWithdrawal
     * @example
     * // Get one GameWithdrawal
     * const gameWithdrawal = await prisma.gameWithdrawal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameWithdrawalFindFirstOrThrowArgs>(args?: SelectSubset<T, GameWithdrawalFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameWithdrawals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameWithdrawals
     * const gameWithdrawals = await prisma.gameWithdrawal.findMany()
     * 
     * // Get first 10 GameWithdrawals
     * const gameWithdrawals = await prisma.gameWithdrawal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWithdrawalWithIdOnly = await prisma.gameWithdrawal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameWithdrawalFindManyArgs>(args?: SelectSubset<T, GameWithdrawalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameWithdrawal.
     * @param {GameWithdrawalCreateArgs} args - Arguments to create a GameWithdrawal.
     * @example
     * // Create one GameWithdrawal
     * const GameWithdrawal = await prisma.gameWithdrawal.create({
     *   data: {
     *     // ... data to create a GameWithdrawal
     *   }
     * })
     * 
     */
    create<T extends GameWithdrawalCreateArgs>(args: SelectSubset<T, GameWithdrawalCreateArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameWithdrawals.
     * @param {GameWithdrawalCreateManyArgs} args - Arguments to create many GameWithdrawals.
     * @example
     * // Create many GameWithdrawals
     * const gameWithdrawal = await prisma.gameWithdrawal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameWithdrawalCreateManyArgs>(args?: SelectSubset<T, GameWithdrawalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GameWithdrawal.
     * @param {GameWithdrawalDeleteArgs} args - Arguments to delete one GameWithdrawal.
     * @example
     * // Delete one GameWithdrawal
     * const GameWithdrawal = await prisma.gameWithdrawal.delete({
     *   where: {
     *     // ... filter to delete one GameWithdrawal
     *   }
     * })
     * 
     */
    delete<T extends GameWithdrawalDeleteArgs>(args: SelectSubset<T, GameWithdrawalDeleteArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameWithdrawal.
     * @param {GameWithdrawalUpdateArgs} args - Arguments to update one GameWithdrawal.
     * @example
     * // Update one GameWithdrawal
     * const gameWithdrawal = await prisma.gameWithdrawal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameWithdrawalUpdateArgs>(args: SelectSubset<T, GameWithdrawalUpdateArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameWithdrawals.
     * @param {GameWithdrawalDeleteManyArgs} args - Arguments to filter GameWithdrawals to delete.
     * @example
     * // Delete a few GameWithdrawals
     * const { count } = await prisma.gameWithdrawal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameWithdrawalDeleteManyArgs>(args?: SelectSubset<T, GameWithdrawalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameWithdrawals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameWithdrawals
     * const gameWithdrawal = await prisma.gameWithdrawal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameWithdrawalUpdateManyArgs>(args: SelectSubset<T, GameWithdrawalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GameWithdrawal.
     * @param {GameWithdrawalUpsertArgs} args - Arguments to update or create a GameWithdrawal.
     * @example
     * // Update or create a GameWithdrawal
     * const gameWithdrawal = await prisma.gameWithdrawal.upsert({
     *   create: {
     *     // ... data to create a GameWithdrawal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameWithdrawal we want to update
     *   }
     * })
     */
    upsert<T extends GameWithdrawalUpsertArgs>(args: SelectSubset<T, GameWithdrawalUpsertArgs<ExtArgs>>): Prisma__GameWithdrawalClient<$Result.GetResult<Prisma.$GameWithdrawalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameWithdrawals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalCountArgs} args - Arguments to filter GameWithdrawals to count.
     * @example
     * // Count the number of GameWithdrawals
     * const count = await prisma.gameWithdrawal.count({
     *   where: {
     *     // ... the filter for the GameWithdrawals we want to count
     *   }
     * })
    **/
    count<T extends GameWithdrawalCountArgs>(
      args?: Subset<T, GameWithdrawalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameWithdrawalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameWithdrawal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameWithdrawalAggregateArgs>(args: Subset<T, GameWithdrawalAggregateArgs>): Prisma.PrismaPromise<GetGameWithdrawalAggregateType<T>>

    /**
     * Group by GameWithdrawal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameWithdrawalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameWithdrawalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameWithdrawalGroupByArgs['orderBy'] }
        : { orderBy?: GameWithdrawalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameWithdrawalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameWithdrawalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameWithdrawal model
   */
  readonly fields: GameWithdrawalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameWithdrawal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameWithdrawalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    wallet<T extends GameWalletDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameWalletDefaultArgs<ExtArgs>>): Prisma__GameWalletClient<$Result.GetResult<Prisma.$GameWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameWithdrawal model
   */
  interface GameWithdrawalFieldRefs {
    readonly id: FieldRef<"GameWithdrawal", 'String'>
    readonly walletId: FieldRef<"GameWithdrawal", 'String'>
    readonly userId: FieldRef<"GameWithdrawal", 'String'>
    readonly amount: FieldRef<"GameWithdrawal", 'Int'>
    readonly method: FieldRef<"GameWithdrawal", 'String'>
    readonly accountNumber: FieldRef<"GameWithdrawal", 'String'>
    readonly accountName: FieldRef<"GameWithdrawal", 'String'>
    readonly status: FieldRef<"GameWithdrawal", 'GameWithdrawalStatus'>
    readonly rejectionReason: FieldRef<"GameWithdrawal", 'String'>
    readonly submittedAt: FieldRef<"GameWithdrawal", 'DateTime'>
    readonly reviewedAt: FieldRef<"GameWithdrawal", 'DateTime'>
    readonly reviewedBy: FieldRef<"GameWithdrawal", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GameWithdrawal findUnique
   */
  export type GameWithdrawalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which GameWithdrawal to fetch.
     */
    where: GameWithdrawalWhereUniqueInput
  }

  /**
   * GameWithdrawal findUniqueOrThrow
   */
  export type GameWithdrawalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which GameWithdrawal to fetch.
     */
    where: GameWithdrawalWhereUniqueInput
  }

  /**
   * GameWithdrawal findFirst
   */
  export type GameWithdrawalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which GameWithdrawal to fetch.
     */
    where?: GameWithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWithdrawals to fetch.
     */
    orderBy?: GameWithdrawalOrderByWithRelationInput | GameWithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameWithdrawals.
     */
    cursor?: GameWithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWithdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWithdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameWithdrawals.
     */
    distinct?: GameWithdrawalScalarFieldEnum | GameWithdrawalScalarFieldEnum[]
  }

  /**
   * GameWithdrawal findFirstOrThrow
   */
  export type GameWithdrawalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which GameWithdrawal to fetch.
     */
    where?: GameWithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWithdrawals to fetch.
     */
    orderBy?: GameWithdrawalOrderByWithRelationInput | GameWithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameWithdrawals.
     */
    cursor?: GameWithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWithdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWithdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameWithdrawals.
     */
    distinct?: GameWithdrawalScalarFieldEnum | GameWithdrawalScalarFieldEnum[]
  }

  /**
   * GameWithdrawal findMany
   */
  export type GameWithdrawalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * Filter, which GameWithdrawals to fetch.
     */
    where?: GameWithdrawalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameWithdrawals to fetch.
     */
    orderBy?: GameWithdrawalOrderByWithRelationInput | GameWithdrawalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameWithdrawals.
     */
    cursor?: GameWithdrawalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameWithdrawals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameWithdrawals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameWithdrawals.
     */
    distinct?: GameWithdrawalScalarFieldEnum | GameWithdrawalScalarFieldEnum[]
  }

  /**
   * GameWithdrawal create
   */
  export type GameWithdrawalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * The data needed to create a GameWithdrawal.
     */
    data: XOR<GameWithdrawalCreateInput, GameWithdrawalUncheckedCreateInput>
  }

  /**
   * GameWithdrawal createMany
   */
  export type GameWithdrawalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameWithdrawals.
     */
    data: GameWithdrawalCreateManyInput | GameWithdrawalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameWithdrawal update
   */
  export type GameWithdrawalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * The data needed to update a GameWithdrawal.
     */
    data: XOR<GameWithdrawalUpdateInput, GameWithdrawalUncheckedUpdateInput>
    /**
     * Choose, which GameWithdrawal to update.
     */
    where: GameWithdrawalWhereUniqueInput
  }

  /**
   * GameWithdrawal updateMany
   */
  export type GameWithdrawalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameWithdrawals.
     */
    data: XOR<GameWithdrawalUpdateManyMutationInput, GameWithdrawalUncheckedUpdateManyInput>
    /**
     * Filter which GameWithdrawals to update
     */
    where?: GameWithdrawalWhereInput
    /**
     * Limit how many GameWithdrawals to update.
     */
    limit?: number
  }

  /**
   * GameWithdrawal upsert
   */
  export type GameWithdrawalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * The filter to search for the GameWithdrawal to update in case it exists.
     */
    where: GameWithdrawalWhereUniqueInput
    /**
     * In case the GameWithdrawal found by the `where` argument doesn't exist, create a new GameWithdrawal with this data.
     */
    create: XOR<GameWithdrawalCreateInput, GameWithdrawalUncheckedCreateInput>
    /**
     * In case the GameWithdrawal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameWithdrawalUpdateInput, GameWithdrawalUncheckedUpdateInput>
  }

  /**
   * GameWithdrawal delete
   */
  export type GameWithdrawalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
    /**
     * Filter which GameWithdrawal to delete.
     */
    where: GameWithdrawalWhereUniqueInput
  }

  /**
   * GameWithdrawal deleteMany
   */
  export type GameWithdrawalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameWithdrawals to delete
     */
    where?: GameWithdrawalWhereInput
    /**
     * Limit how many GameWithdrawals to delete.
     */
    limit?: number
  }

  /**
   * GameWithdrawal without action
   */
  export type GameWithdrawalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameWithdrawal
     */
    select?: GameWithdrawalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameWithdrawal
     */
    omit?: GameWithdrawalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameWithdrawalInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    resetToken: 'resetToken',
    resetTokenExpiry: 'resetTokenExpiry',
    blocked: 'blocked'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SeekerProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    phone: 'phone',
    location: 'location',
    summary: 'summary',
    skills: 'skills',
    linkedin: 'linkedin',
    github: 'github',
    portfolio: 'portfolio',
    education: 'education',
    experience: 'experience',
    currentProject: 'currentProject',
    jobType: 'jobType',
    desiredSalary: 'desiredSalary',
    remotePref: 'remotePref',
    cvUrl: 'cvUrl',
    updatedAt: 'updatedAt'
  };

  export type SeekerProfileScalarFieldEnum = (typeof SeekerProfileScalarFieldEnum)[keyof typeof SeekerProfileScalarFieldEnum]


  export const JobScalarFieldEnum: {
    id: 'id',
    title: 'title',
    company: 'company',
    location: 'location',
    type: 'type',
    category: 'category',
    description: 'description',
    requirements: 'requirements',
    benefits: 'benefits',
    salaryMin: 'salaryMin',
    salaryMax: 'salaryMax',
    deadline: 'deadline',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobId: 'jobId',
    cvUrl: 'cvUrl',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    applicationId: 'applicationId',
    amount: 'amount',
    method: 'method',
    receiptUrl: 'receiptUrl',
    receiptRef: 'receiptRef',
    status: 'status',
    rejectionReason: 'rejectionReason',
    submittedAt: 'submittedAt',
    reviewedAt: 'reviewedAt',
    reviewedBy: 'reviewedBy'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const PaymentSettingScalarFieldEnum: {
    id: 'id',
    method: 'method',
    phone: 'phone',
    name: 'name',
    address: 'address',
    active: 'active',
    updatedAt: 'updatedAt'
  };

  export type PaymentSettingScalarFieldEnum = (typeof PaymentSettingScalarFieldEnum)[keyof typeof PaymentSettingScalarFieldEnum]


  export const SavedJobScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobId: 'jobId',
    savedAt: 'savedAt'
  };

  export type SavedJobScalarFieldEnum = (typeof SavedJobScalarFieldEnum)[keyof typeof SavedJobScalarFieldEnum]


  export const AlertScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    keywords: 'keywords',
    location: 'location',
    type: 'type',
    frequency: 'frequency',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AlertScalarFieldEnum = (typeof AlertScalarFieldEnum)[keyof typeof AlertScalarFieldEnum]


  export const AnalyticsSummaryScalarFieldEnum: {
    id: 'id',
    date: 'date',
    visitors: 'visitors',
    pageViews: 'pageViews',
    applications: 'applications',
    newUsers: 'newUsers'
  };

  export type AnalyticsSummaryScalarFieldEnum = (typeof AnalyticsSummaryScalarFieldEnum)[keyof typeof AnalyticsSummaryScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    body: 'body',
    type: 'type',
    read: 'read',
    link: 'link',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const PlatformSettingScalarFieldEnum: {
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
  };

  export type PlatformSettingScalarFieldEnum = (typeof PlatformSettingScalarFieldEnum)[keyof typeof PlatformSettingScalarFieldEnum]


  export const GameWalletScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    balance: 'balance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GameWalletScalarFieldEnum = (typeof GameWalletScalarFieldEnum)[keyof typeof GameWalletScalarFieldEnum]


  export const GameDepositScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId',
    amount: 'amount',
    method: 'method',
    screenshotUrl: 'screenshotUrl',
    status: 'status',
    rejectionReason: 'rejectionReason',
    submittedAt: 'submittedAt',
    reviewedAt: 'reviewedAt',
    reviewedBy: 'reviewedBy'
  };

  export type GameDepositScalarFieldEnum = (typeof GameDepositScalarFieldEnum)[keyof typeof GameDepositScalarFieldEnum]


  export const GameSessionScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId',
    wagerAmount: 'wagerAmount',
    finalScore: 'finalScore',
    winAmount: 'winAmount',
    milestones: 'milestones',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    completed: 'completed'
  };

  export type GameSessionScalarFieldEnum = (typeof GameSessionScalarFieldEnum)[keyof typeof GameSessionScalarFieldEnum]


  export const GameWithdrawalScalarFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId',
    amount: 'amount',
    method: 'method',
    accountNumber: 'accountNumber',
    accountName: 'accountName',
    status: 'status',
    rejectionReason: 'rejectionReason',
    submittedAt: 'submittedAt',
    reviewedAt: 'reviewedAt',
    reviewedBy: 'reviewedBy'
  };

  export type GameWithdrawalScalarFieldEnum = (typeof GameWithdrawalScalarFieldEnum)[keyof typeof GameWithdrawalScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    resetToken: 'resetToken'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SeekerProfileOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    phone: 'phone',
    location: 'location',
    summary: 'summary',
    linkedin: 'linkedin',
    github: 'github',
    portfolio: 'portfolio',
    currentProject: 'currentProject',
    jobType: 'jobType',
    desiredSalary: 'desiredSalary',
    remotePref: 'remotePref',
    cvUrl: 'cvUrl'
  };

  export type SeekerProfileOrderByRelevanceFieldEnum = (typeof SeekerProfileOrderByRelevanceFieldEnum)[keyof typeof SeekerProfileOrderByRelevanceFieldEnum]


  export const JobOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    company: 'company',
    location: 'location',
    type: 'type',
    category: 'category',
    description: 'description'
  };

  export type JobOrderByRelevanceFieldEnum = (typeof JobOrderByRelevanceFieldEnum)[keyof typeof JobOrderByRelevanceFieldEnum]


  export const ApplicationOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobId: 'jobId',
    cvUrl: 'cvUrl'
  };

  export type ApplicationOrderByRelevanceFieldEnum = (typeof ApplicationOrderByRelevanceFieldEnum)[keyof typeof ApplicationOrderByRelevanceFieldEnum]


  export const PaymentOrderByRelevanceFieldEnum: {
    id: 'id',
    applicationId: 'applicationId',
    receiptUrl: 'receiptUrl',
    receiptRef: 'receiptRef',
    rejectionReason: 'rejectionReason',
    reviewedBy: 'reviewedBy'
  };

  export type PaymentOrderByRelevanceFieldEnum = (typeof PaymentOrderByRelevanceFieldEnum)[keyof typeof PaymentOrderByRelevanceFieldEnum]


  export const PaymentSettingOrderByRelevanceFieldEnum: {
    id: 'id',
    method: 'method',
    phone: 'phone',
    name: 'name',
    address: 'address'
  };

  export type PaymentSettingOrderByRelevanceFieldEnum = (typeof PaymentSettingOrderByRelevanceFieldEnum)[keyof typeof PaymentSettingOrderByRelevanceFieldEnum]


  export const SavedJobOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobId: 'jobId'
  };

  export type SavedJobOrderByRelevanceFieldEnum = (typeof SavedJobOrderByRelevanceFieldEnum)[keyof typeof SavedJobOrderByRelevanceFieldEnum]


  export const AlertOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    keywords: 'keywords',
    location: 'location',
    type: 'type',
    frequency: 'frequency'
  };

  export type AlertOrderByRelevanceFieldEnum = (typeof AlertOrderByRelevanceFieldEnum)[keyof typeof AlertOrderByRelevanceFieldEnum]


  export const AnalyticsSummaryOrderByRelevanceFieldEnum: {
    id: 'id'
  };

  export type AnalyticsSummaryOrderByRelevanceFieldEnum = (typeof AnalyticsSummaryOrderByRelevanceFieldEnum)[keyof typeof AnalyticsSummaryOrderByRelevanceFieldEnum]


  export const NotificationOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    body: 'body',
    type: 'type',
    link: 'link'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  export const PlatformSettingOrderByRelevanceFieldEnum: {
    key: 'key',
    value: 'value'
  };

  export type PlatformSettingOrderByRelevanceFieldEnum = (typeof PlatformSettingOrderByRelevanceFieldEnum)[keyof typeof PlatformSettingOrderByRelevanceFieldEnum]


  export const GameWalletOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId'
  };

  export type GameWalletOrderByRelevanceFieldEnum = (typeof GameWalletOrderByRelevanceFieldEnum)[keyof typeof GameWalletOrderByRelevanceFieldEnum]


  export const GameDepositOrderByRelevanceFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId',
    screenshotUrl: 'screenshotUrl',
    rejectionReason: 'rejectionReason',
    reviewedBy: 'reviewedBy'
  };

  export type GameDepositOrderByRelevanceFieldEnum = (typeof GameDepositOrderByRelevanceFieldEnum)[keyof typeof GameDepositOrderByRelevanceFieldEnum]


  export const GameSessionOrderByRelevanceFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId'
  };

  export type GameSessionOrderByRelevanceFieldEnum = (typeof GameSessionOrderByRelevanceFieldEnum)[keyof typeof GameSessionOrderByRelevanceFieldEnum]


  export const GameWithdrawalOrderByRelevanceFieldEnum: {
    id: 'id',
    walletId: 'walletId',
    userId: 'userId',
    method: 'method',
    accountNumber: 'accountNumber',
    accountName: 'accountName',
    rejectionReason: 'rejectionReason',
    reviewedBy: 'reviewedBy'
  };

  export type GameWithdrawalOrderByRelevanceFieldEnum = (typeof GameWithdrawalOrderByRelevanceFieldEnum)[keyof typeof GameWithdrawalOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'JobStatus'
   */
  export type EnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus'>
    


  /**
   * Reference to a field of type 'ApplicationStatus'
   */
  export type EnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'GameDepositStatus'
   */
  export type EnumGameDepositStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameDepositStatus'>
    


  /**
   * Reference to a field of type 'GameWithdrawalStatus'
   */
  export type EnumGameWithdrawalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameWithdrawalStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    blocked?: BoolFilter<"User"> | boolean
    profile?: XOR<SeekerProfileNullableScalarRelationFilter, SeekerProfileWhereInput> | null
    applications?: ApplicationListRelationFilter
    savedJobs?: SavedJobListRelationFilter
    alerts?: AlertListRelationFilter
    notifications?: NotificationListRelationFilter
    gameWallet?: XOR<GameWalletNullableScalarRelationFilter, GameWalletWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiry?: SortOrderInput | SortOrder
    blocked?: SortOrder
    profile?: SeekerProfileOrderByWithRelationInput
    applications?: ApplicationOrderByRelationAggregateInput
    savedJobs?: SavedJobOrderByRelationAggregateInput
    alerts?: AlertOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    gameWallet?: GameWalletOrderByWithRelationInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    blocked?: BoolFilter<"User"> | boolean
    profile?: XOR<SeekerProfileNullableScalarRelationFilter, SeekerProfileWhereInput> | null
    applications?: ApplicationListRelationFilter
    savedJobs?: SavedJobListRelationFilter
    alerts?: AlertListRelationFilter
    notifications?: NotificationListRelationFilter
    gameWallet?: XOR<GameWalletNullableScalarRelationFilter, GameWalletWhereInput> | null
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiry?: SortOrderInput | SortOrder
    blocked?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    resetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    blocked?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type SeekerProfileWhereInput = {
    AND?: SeekerProfileWhereInput | SeekerProfileWhereInput[]
    OR?: SeekerProfileWhereInput[]
    NOT?: SeekerProfileWhereInput | SeekerProfileWhereInput[]
    id?: StringFilter<"SeekerProfile"> | string
    userId?: StringFilter<"SeekerProfile"> | string
    phone?: StringNullableFilter<"SeekerProfile"> | string | null
    location?: StringNullableFilter<"SeekerProfile"> | string | null
    summary?: StringNullableFilter<"SeekerProfile"> | string | null
    skills?: JsonFilter<"SeekerProfile">
    linkedin?: StringNullableFilter<"SeekerProfile"> | string | null
    github?: StringNullableFilter<"SeekerProfile"> | string | null
    portfolio?: StringNullableFilter<"SeekerProfile"> | string | null
    education?: JsonFilter<"SeekerProfile">
    experience?: JsonFilter<"SeekerProfile">
    currentProject?: StringNullableFilter<"SeekerProfile"> | string | null
    jobType?: StringNullableFilter<"SeekerProfile"> | string | null
    desiredSalary?: StringNullableFilter<"SeekerProfile"> | string | null
    remotePref?: StringNullableFilter<"SeekerProfile"> | string | null
    cvUrl?: StringNullableFilter<"SeekerProfile"> | string | null
    updatedAt?: DateTimeFilter<"SeekerProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SeekerProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    skills?: SortOrder
    linkedin?: SortOrderInput | SortOrder
    github?: SortOrderInput | SortOrder
    portfolio?: SortOrderInput | SortOrder
    education?: SortOrder
    experience?: SortOrder
    currentProject?: SortOrderInput | SortOrder
    jobType?: SortOrderInput | SortOrder
    desiredSalary?: SortOrderInput | SortOrder
    remotePref?: SortOrderInput | SortOrder
    cvUrl?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: SeekerProfileOrderByRelevanceInput
  }

  export type SeekerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: SeekerProfileWhereInput | SeekerProfileWhereInput[]
    OR?: SeekerProfileWhereInput[]
    NOT?: SeekerProfileWhereInput | SeekerProfileWhereInput[]
    phone?: StringNullableFilter<"SeekerProfile"> | string | null
    location?: StringNullableFilter<"SeekerProfile"> | string | null
    summary?: StringNullableFilter<"SeekerProfile"> | string | null
    skills?: JsonFilter<"SeekerProfile">
    linkedin?: StringNullableFilter<"SeekerProfile"> | string | null
    github?: StringNullableFilter<"SeekerProfile"> | string | null
    portfolio?: StringNullableFilter<"SeekerProfile"> | string | null
    education?: JsonFilter<"SeekerProfile">
    experience?: JsonFilter<"SeekerProfile">
    currentProject?: StringNullableFilter<"SeekerProfile"> | string | null
    jobType?: StringNullableFilter<"SeekerProfile"> | string | null
    desiredSalary?: StringNullableFilter<"SeekerProfile"> | string | null
    remotePref?: StringNullableFilter<"SeekerProfile"> | string | null
    cvUrl?: StringNullableFilter<"SeekerProfile"> | string | null
    updatedAt?: DateTimeFilter<"SeekerProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type SeekerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    phone?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    skills?: SortOrder
    linkedin?: SortOrderInput | SortOrder
    github?: SortOrderInput | SortOrder
    portfolio?: SortOrderInput | SortOrder
    education?: SortOrder
    experience?: SortOrder
    currentProject?: SortOrderInput | SortOrder
    jobType?: SortOrderInput | SortOrder
    desiredSalary?: SortOrderInput | SortOrder
    remotePref?: SortOrderInput | SortOrder
    cvUrl?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: SeekerProfileCountOrderByAggregateInput
    _max?: SeekerProfileMaxOrderByAggregateInput
    _min?: SeekerProfileMinOrderByAggregateInput
  }

  export type SeekerProfileScalarWhereWithAggregatesInput = {
    AND?: SeekerProfileScalarWhereWithAggregatesInput | SeekerProfileScalarWhereWithAggregatesInput[]
    OR?: SeekerProfileScalarWhereWithAggregatesInput[]
    NOT?: SeekerProfileScalarWhereWithAggregatesInput | SeekerProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeekerProfile"> | string
    userId?: StringWithAggregatesFilter<"SeekerProfile"> | string
    phone?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    location?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    summary?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    skills?: JsonWithAggregatesFilter<"SeekerProfile">
    linkedin?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    github?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    portfolio?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    education?: JsonWithAggregatesFilter<"SeekerProfile">
    experience?: JsonWithAggregatesFilter<"SeekerProfile">
    currentProject?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    jobType?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    desiredSalary?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    remotePref?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    cvUrl?: StringNullableWithAggregatesFilter<"SeekerProfile"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"SeekerProfile"> | Date | string
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    id?: StringFilter<"Job"> | string
    title?: StringFilter<"Job"> | string
    company?: StringFilter<"Job"> | string
    location?: StringFilter<"Job"> | string
    type?: StringFilter<"Job"> | string
    category?: StringFilter<"Job"> | string
    description?: StringFilter<"Job"> | string
    requirements?: JsonFilter<"Job">
    benefits?: JsonFilter<"Job">
    salaryMin?: IntNullableFilter<"Job"> | number | null
    salaryMax?: IntNullableFilter<"Job"> | number | null
    deadline?: DateTimeNullableFilter<"Job"> | Date | string | null
    status?: EnumJobStatusFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    applications?: ApplicationListRelationFilter
    savedBy?: SavedJobListRelationFilter
  }

  export type JobOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    type?: SortOrder
    category?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    benefits?: SortOrder
    salaryMin?: SortOrderInput | SortOrder
    salaryMax?: SortOrderInput | SortOrder
    deadline?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    applications?: ApplicationOrderByRelationAggregateInput
    savedBy?: SavedJobOrderByRelationAggregateInput
    _relevance?: JobOrderByRelevanceInput
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    title?: StringFilter<"Job"> | string
    company?: StringFilter<"Job"> | string
    location?: StringFilter<"Job"> | string
    type?: StringFilter<"Job"> | string
    category?: StringFilter<"Job"> | string
    description?: StringFilter<"Job"> | string
    requirements?: JsonFilter<"Job">
    benefits?: JsonFilter<"Job">
    salaryMin?: IntNullableFilter<"Job"> | number | null
    salaryMax?: IntNullableFilter<"Job"> | number | null
    deadline?: DateTimeNullableFilter<"Job"> | Date | string | null
    status?: EnumJobStatusFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    applications?: ApplicationListRelationFilter
    savedBy?: SavedJobListRelationFilter
  }, "id">

  export type JobOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    type?: SortOrder
    category?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    benefits?: SortOrder
    salaryMin?: SortOrderInput | SortOrder
    salaryMax?: SortOrderInput | SortOrder
    deadline?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JobCountOrderByAggregateInput
    _avg?: JobAvgOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
    _sum?: JobSumOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Job"> | string
    title?: StringWithAggregatesFilter<"Job"> | string
    company?: StringWithAggregatesFilter<"Job"> | string
    location?: StringWithAggregatesFilter<"Job"> | string
    type?: StringWithAggregatesFilter<"Job"> | string
    category?: StringWithAggregatesFilter<"Job"> | string
    description?: StringWithAggregatesFilter<"Job"> | string
    requirements?: JsonWithAggregatesFilter<"Job">
    benefits?: JsonWithAggregatesFilter<"Job">
    salaryMin?: IntNullableWithAggregatesFilter<"Job"> | number | null
    salaryMax?: IntNullableWithAggregatesFilter<"Job"> | number | null
    deadline?: DateTimeNullableWithAggregatesFilter<"Job"> | Date | string | null
    status?: EnumJobStatusWithAggregatesFilter<"Job"> | $Enums.JobStatus
    createdAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
  }

  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: StringFilter<"Application"> | string
    userId?: StringFilter<"Application"> | string
    jobId?: StringFilter<"Application"> | string
    cvUrl?: StringFilter<"Application"> | string
    status?: EnumApplicationStatusFilter<"Application"> | $Enums.ApplicationStatus
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    payment?: XOR<PaymentNullableScalarRelationFilter, PaymentWhereInput> | null
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    cvUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
    payment?: PaymentOrderByWithRelationInput
    _relevance?: ApplicationOrderByRelevanceInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_jobId?: ApplicationUserIdJobIdCompoundUniqueInput
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    userId?: StringFilter<"Application"> | string
    jobId?: StringFilter<"Application"> | string
    cvUrl?: StringFilter<"Application"> | string
    status?: EnumApplicationStatusFilter<"Application"> | $Enums.ApplicationStatus
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
    payment?: XOR<PaymentNullableScalarRelationFilter, PaymentWhereInput> | null
  }, "id" | "userId_jobId">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    cvUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Application"> | string
    userId?: StringWithAggregatesFilter<"Application"> | string
    jobId?: StringWithAggregatesFilter<"Application"> | string
    cvUrl?: StringWithAggregatesFilter<"Application"> | string
    status?: EnumApplicationStatusWithAggregatesFilter<"Application"> | $Enums.ApplicationStatus
    createdAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    applicationId?: StringFilter<"Payment"> | string
    amount?: IntFilter<"Payment"> | number
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    receiptUrl?: StringFilter<"Payment"> | string
    receiptRef?: StringNullableFilter<"Payment"> | string | null
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    rejectionReason?: StringNullableFilter<"Payment"> | string | null
    submittedAt?: DateTimeFilter<"Payment"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewedBy?: StringNullableFilter<"Payment"> | string | null
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    applicationId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    receiptUrl?: SortOrder
    receiptRef?: SortOrderInput | SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    application?: ApplicationOrderByWithRelationInput
    _relevance?: PaymentOrderByRelevanceInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    applicationId?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    amount?: IntFilter<"Payment"> | number
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    receiptUrl?: StringFilter<"Payment"> | string
    receiptRef?: StringNullableFilter<"Payment"> | string | null
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    rejectionReason?: StringNullableFilter<"Payment"> | string | null
    submittedAt?: DateTimeFilter<"Payment"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewedBy?: StringNullableFilter<"Payment"> | string | null
    application?: XOR<ApplicationScalarRelationFilter, ApplicationWhereInput>
  }, "id" | "applicationId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    applicationId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    receiptUrl?: SortOrder
    receiptRef?: SortOrderInput | SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    applicationId?: StringWithAggregatesFilter<"Payment"> | string
    amount?: IntWithAggregatesFilter<"Payment"> | number
    method?: EnumPaymentMethodWithAggregatesFilter<"Payment"> | $Enums.PaymentMethod
    receiptUrl?: StringWithAggregatesFilter<"Payment"> | string
    receiptRef?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    rejectionReason?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"Payment"> | string | null
  }

  export type PaymentSettingWhereInput = {
    AND?: PaymentSettingWhereInput | PaymentSettingWhereInput[]
    OR?: PaymentSettingWhereInput[]
    NOT?: PaymentSettingWhereInput | PaymentSettingWhereInput[]
    id?: StringFilter<"PaymentSetting"> | string
    method?: StringFilter<"PaymentSetting"> | string
    phone?: StringFilter<"PaymentSetting"> | string
    name?: StringFilter<"PaymentSetting"> | string
    address?: StringNullableFilter<"PaymentSetting"> | string | null
    active?: BoolFilter<"PaymentSetting"> | boolean
    updatedAt?: DateTimeFilter<"PaymentSetting"> | Date | string
  }

  export type PaymentSettingOrderByWithRelationInput = {
    id?: SortOrder
    method?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
    _relevance?: PaymentSettingOrderByRelevanceInput
  }

  export type PaymentSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    method?: string
    AND?: PaymentSettingWhereInput | PaymentSettingWhereInput[]
    OR?: PaymentSettingWhereInput[]
    NOT?: PaymentSettingWhereInput | PaymentSettingWhereInput[]
    phone?: StringFilter<"PaymentSetting"> | string
    name?: StringFilter<"PaymentSetting"> | string
    address?: StringNullableFilter<"PaymentSetting"> | string | null
    active?: BoolFilter<"PaymentSetting"> | boolean
    updatedAt?: DateTimeFilter<"PaymentSetting"> | Date | string
  }, "id" | "method">

  export type PaymentSettingOrderByWithAggregationInput = {
    id?: SortOrder
    method?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentSettingCountOrderByAggregateInput
    _max?: PaymentSettingMaxOrderByAggregateInput
    _min?: PaymentSettingMinOrderByAggregateInput
  }

  export type PaymentSettingScalarWhereWithAggregatesInput = {
    AND?: PaymentSettingScalarWhereWithAggregatesInput | PaymentSettingScalarWhereWithAggregatesInput[]
    OR?: PaymentSettingScalarWhereWithAggregatesInput[]
    NOT?: PaymentSettingScalarWhereWithAggregatesInput | PaymentSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentSetting"> | string
    method?: StringWithAggregatesFilter<"PaymentSetting"> | string
    phone?: StringWithAggregatesFilter<"PaymentSetting"> | string
    name?: StringWithAggregatesFilter<"PaymentSetting"> | string
    address?: StringNullableWithAggregatesFilter<"PaymentSetting"> | string | null
    active?: BoolWithAggregatesFilter<"PaymentSetting"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentSetting"> | Date | string
  }

  export type SavedJobWhereInput = {
    AND?: SavedJobWhereInput | SavedJobWhereInput[]
    OR?: SavedJobWhereInput[]
    NOT?: SavedJobWhereInput | SavedJobWhereInput[]
    id?: StringFilter<"SavedJob"> | string
    userId?: StringFilter<"SavedJob"> | string
    jobId?: StringFilter<"SavedJob"> | string
    savedAt?: DateTimeFilter<"SavedJob"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
  }

  export type SavedJobOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    savedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    job?: JobOrderByWithRelationInput
    _relevance?: SavedJobOrderByRelevanceInput
  }

  export type SavedJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_jobId?: SavedJobUserIdJobIdCompoundUniqueInput
    AND?: SavedJobWhereInput | SavedJobWhereInput[]
    OR?: SavedJobWhereInput[]
    NOT?: SavedJobWhereInput | SavedJobWhereInput[]
    userId?: StringFilter<"SavedJob"> | string
    jobId?: StringFilter<"SavedJob"> | string
    savedAt?: DateTimeFilter<"SavedJob"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    job?: XOR<JobScalarRelationFilter, JobWhereInput>
  }, "id" | "userId_jobId">

  export type SavedJobOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    savedAt?: SortOrder
    _count?: SavedJobCountOrderByAggregateInput
    _max?: SavedJobMaxOrderByAggregateInput
    _min?: SavedJobMinOrderByAggregateInput
  }

  export type SavedJobScalarWhereWithAggregatesInput = {
    AND?: SavedJobScalarWhereWithAggregatesInput | SavedJobScalarWhereWithAggregatesInput[]
    OR?: SavedJobScalarWhereWithAggregatesInput[]
    NOT?: SavedJobScalarWhereWithAggregatesInput | SavedJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SavedJob"> | string
    userId?: StringWithAggregatesFilter<"SavedJob"> | string
    jobId?: StringWithAggregatesFilter<"SavedJob"> | string
    savedAt?: DateTimeWithAggregatesFilter<"SavedJob"> | Date | string
  }

  export type AlertWhereInput = {
    AND?: AlertWhereInput | AlertWhereInput[]
    OR?: AlertWhereInput[]
    NOT?: AlertWhereInput | AlertWhereInput[]
    id?: StringFilter<"Alert"> | string
    userId?: StringFilter<"Alert"> | string
    keywords?: StringFilter<"Alert"> | string
    location?: StringFilter<"Alert"> | string
    type?: StringFilter<"Alert"> | string
    frequency?: StringFilter<"Alert"> | string
    active?: BoolFilter<"Alert"> | boolean
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AlertOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    location?: SortOrder
    type?: SortOrder
    frequency?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: AlertOrderByRelevanceInput
  }

  export type AlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlertWhereInput | AlertWhereInput[]
    OR?: AlertWhereInput[]
    NOT?: AlertWhereInput | AlertWhereInput[]
    userId?: StringFilter<"Alert"> | string
    keywords?: StringFilter<"Alert"> | string
    location?: StringFilter<"Alert"> | string
    type?: StringFilter<"Alert"> | string
    frequency?: StringFilter<"Alert"> | string
    active?: BoolFilter<"Alert"> | boolean
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AlertOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    location?: SortOrder
    type?: SortOrder
    frequency?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AlertCountOrderByAggregateInput
    _max?: AlertMaxOrderByAggregateInput
    _min?: AlertMinOrderByAggregateInput
  }

  export type AlertScalarWhereWithAggregatesInput = {
    AND?: AlertScalarWhereWithAggregatesInput | AlertScalarWhereWithAggregatesInput[]
    OR?: AlertScalarWhereWithAggregatesInput[]
    NOT?: AlertScalarWhereWithAggregatesInput | AlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Alert"> | string
    userId?: StringWithAggregatesFilter<"Alert"> | string
    keywords?: StringWithAggregatesFilter<"Alert"> | string
    location?: StringWithAggregatesFilter<"Alert"> | string
    type?: StringWithAggregatesFilter<"Alert"> | string
    frequency?: StringWithAggregatesFilter<"Alert"> | string
    active?: BoolWithAggregatesFilter<"Alert"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Alert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Alert"> | Date | string
  }

  export type AnalyticsSummaryWhereInput = {
    AND?: AnalyticsSummaryWhereInput | AnalyticsSummaryWhereInput[]
    OR?: AnalyticsSummaryWhereInput[]
    NOT?: AnalyticsSummaryWhereInput | AnalyticsSummaryWhereInput[]
    id?: StringFilter<"AnalyticsSummary"> | string
    date?: DateTimeFilter<"AnalyticsSummary"> | Date | string
    visitors?: IntFilter<"AnalyticsSummary"> | number
    pageViews?: IntFilter<"AnalyticsSummary"> | number
    applications?: IntFilter<"AnalyticsSummary"> | number
    newUsers?: IntFilter<"AnalyticsSummary"> | number
  }

  export type AnalyticsSummaryOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
    _relevance?: AnalyticsSummaryOrderByRelevanceInput
  }

  export type AnalyticsSummaryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: AnalyticsSummaryWhereInput | AnalyticsSummaryWhereInput[]
    OR?: AnalyticsSummaryWhereInput[]
    NOT?: AnalyticsSummaryWhereInput | AnalyticsSummaryWhereInput[]
    visitors?: IntFilter<"AnalyticsSummary"> | number
    pageViews?: IntFilter<"AnalyticsSummary"> | number
    applications?: IntFilter<"AnalyticsSummary"> | number
    newUsers?: IntFilter<"AnalyticsSummary"> | number
  }, "id" | "date">

  export type AnalyticsSummaryOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
    _count?: AnalyticsSummaryCountOrderByAggregateInput
    _avg?: AnalyticsSummaryAvgOrderByAggregateInput
    _max?: AnalyticsSummaryMaxOrderByAggregateInput
    _min?: AnalyticsSummaryMinOrderByAggregateInput
    _sum?: AnalyticsSummarySumOrderByAggregateInput
  }

  export type AnalyticsSummaryScalarWhereWithAggregatesInput = {
    AND?: AnalyticsSummaryScalarWhereWithAggregatesInput | AnalyticsSummaryScalarWhereWithAggregatesInput[]
    OR?: AnalyticsSummaryScalarWhereWithAggregatesInput[]
    NOT?: AnalyticsSummaryScalarWhereWithAggregatesInput | AnalyticsSummaryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalyticsSummary"> | string
    date?: DateTimeWithAggregatesFilter<"AnalyticsSummary"> | Date | string
    visitors?: IntWithAggregatesFilter<"AnalyticsSummary"> | number
    pageViews?: IntWithAggregatesFilter<"AnalyticsSummary"> | number
    applications?: IntWithAggregatesFilter<"AnalyticsSummary"> | number
    newUsers?: IntWithAggregatesFilter<"AnalyticsSummary"> | number
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    link?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    read?: SortOrder
    link?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    link?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    read?: SortOrder
    link?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    link?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type PlatformSettingWhereInput = {
    AND?: PlatformSettingWhereInput | PlatformSettingWhereInput[]
    OR?: PlatformSettingWhereInput[]
    NOT?: PlatformSettingWhereInput | PlatformSettingWhereInput[]
    key?: StringFilter<"PlatformSetting"> | string
    value?: StringFilter<"PlatformSetting"> | string
    updatedAt?: DateTimeFilter<"PlatformSetting"> | Date | string
  }

  export type PlatformSettingOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _relevance?: PlatformSettingOrderByRelevanceInput
  }

  export type PlatformSettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: PlatformSettingWhereInput | PlatformSettingWhereInput[]
    OR?: PlatformSettingWhereInput[]
    NOT?: PlatformSettingWhereInput | PlatformSettingWhereInput[]
    value?: StringFilter<"PlatformSetting"> | string
    updatedAt?: DateTimeFilter<"PlatformSetting"> | Date | string
  }, "key">

  export type PlatformSettingOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _count?: PlatformSettingCountOrderByAggregateInput
    _max?: PlatformSettingMaxOrderByAggregateInput
    _min?: PlatformSettingMinOrderByAggregateInput
  }

  export type PlatformSettingScalarWhereWithAggregatesInput = {
    AND?: PlatformSettingScalarWhereWithAggregatesInput | PlatformSettingScalarWhereWithAggregatesInput[]
    OR?: PlatformSettingScalarWhereWithAggregatesInput[]
    NOT?: PlatformSettingScalarWhereWithAggregatesInput | PlatformSettingScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"PlatformSetting"> | string
    value?: StringWithAggregatesFilter<"PlatformSetting"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"PlatformSetting"> | Date | string
  }

  export type GameWalletWhereInput = {
    AND?: GameWalletWhereInput | GameWalletWhereInput[]
    OR?: GameWalletWhereInput[]
    NOT?: GameWalletWhereInput | GameWalletWhereInput[]
    id?: StringFilter<"GameWallet"> | string
    userId?: StringFilter<"GameWallet"> | string
    balance?: IntFilter<"GameWallet"> | number
    createdAt?: DateTimeFilter<"GameWallet"> | Date | string
    updatedAt?: DateTimeFilter<"GameWallet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    deposits?: GameDepositListRelationFilter
    sessions?: GameSessionListRelationFilter
    withdrawals?: GameWithdrawalListRelationFilter
  }

  export type GameWalletOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    deposits?: GameDepositOrderByRelationAggregateInput
    sessions?: GameSessionOrderByRelationAggregateInput
    withdrawals?: GameWithdrawalOrderByRelationAggregateInput
    _relevance?: GameWalletOrderByRelevanceInput
  }

  export type GameWalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: GameWalletWhereInput | GameWalletWhereInput[]
    OR?: GameWalletWhereInput[]
    NOT?: GameWalletWhereInput | GameWalletWhereInput[]
    balance?: IntFilter<"GameWallet"> | number
    createdAt?: DateTimeFilter<"GameWallet"> | Date | string
    updatedAt?: DateTimeFilter<"GameWallet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    deposits?: GameDepositListRelationFilter
    sessions?: GameSessionListRelationFilter
    withdrawals?: GameWithdrawalListRelationFilter
  }, "id" | "userId">

  export type GameWalletOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GameWalletCountOrderByAggregateInput
    _avg?: GameWalletAvgOrderByAggregateInput
    _max?: GameWalletMaxOrderByAggregateInput
    _min?: GameWalletMinOrderByAggregateInput
    _sum?: GameWalletSumOrderByAggregateInput
  }

  export type GameWalletScalarWhereWithAggregatesInput = {
    AND?: GameWalletScalarWhereWithAggregatesInput | GameWalletScalarWhereWithAggregatesInput[]
    OR?: GameWalletScalarWhereWithAggregatesInput[]
    NOT?: GameWalletScalarWhereWithAggregatesInput | GameWalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameWallet"> | string
    userId?: StringWithAggregatesFilter<"GameWallet"> | string
    balance?: IntWithAggregatesFilter<"GameWallet"> | number
    createdAt?: DateTimeWithAggregatesFilter<"GameWallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GameWallet"> | Date | string
  }

  export type GameDepositWhereInput = {
    AND?: GameDepositWhereInput | GameDepositWhereInput[]
    OR?: GameDepositWhereInput[]
    NOT?: GameDepositWhereInput | GameDepositWhereInput[]
    id?: StringFilter<"GameDeposit"> | string
    walletId?: StringFilter<"GameDeposit"> | string
    userId?: StringFilter<"GameDeposit"> | string
    amount?: IntFilter<"GameDeposit"> | number
    method?: EnumPaymentMethodFilter<"GameDeposit"> | $Enums.PaymentMethod
    screenshotUrl?: StringFilter<"GameDeposit"> | string
    status?: EnumGameDepositStatusFilter<"GameDeposit"> | $Enums.GameDepositStatus
    rejectionReason?: StringNullableFilter<"GameDeposit"> | string | null
    submittedAt?: DateTimeFilter<"GameDeposit"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"GameDeposit"> | Date | string | null
    reviewedBy?: StringNullableFilter<"GameDeposit"> | string | null
    wallet?: XOR<GameWalletScalarRelationFilter, GameWalletWhereInput>
  }

  export type GameDepositOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    screenshotUrl?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    wallet?: GameWalletOrderByWithRelationInput
    _relevance?: GameDepositOrderByRelevanceInput
  }

  export type GameDepositWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameDepositWhereInput | GameDepositWhereInput[]
    OR?: GameDepositWhereInput[]
    NOT?: GameDepositWhereInput | GameDepositWhereInput[]
    walletId?: StringFilter<"GameDeposit"> | string
    userId?: StringFilter<"GameDeposit"> | string
    amount?: IntFilter<"GameDeposit"> | number
    method?: EnumPaymentMethodFilter<"GameDeposit"> | $Enums.PaymentMethod
    screenshotUrl?: StringFilter<"GameDeposit"> | string
    status?: EnumGameDepositStatusFilter<"GameDeposit"> | $Enums.GameDepositStatus
    rejectionReason?: StringNullableFilter<"GameDeposit"> | string | null
    submittedAt?: DateTimeFilter<"GameDeposit"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"GameDeposit"> | Date | string | null
    reviewedBy?: StringNullableFilter<"GameDeposit"> | string | null
    wallet?: XOR<GameWalletScalarRelationFilter, GameWalletWhereInput>
  }, "id">

  export type GameDepositOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    screenshotUrl?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    _count?: GameDepositCountOrderByAggregateInput
    _avg?: GameDepositAvgOrderByAggregateInput
    _max?: GameDepositMaxOrderByAggregateInput
    _min?: GameDepositMinOrderByAggregateInput
    _sum?: GameDepositSumOrderByAggregateInput
  }

  export type GameDepositScalarWhereWithAggregatesInput = {
    AND?: GameDepositScalarWhereWithAggregatesInput | GameDepositScalarWhereWithAggregatesInput[]
    OR?: GameDepositScalarWhereWithAggregatesInput[]
    NOT?: GameDepositScalarWhereWithAggregatesInput | GameDepositScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameDeposit"> | string
    walletId?: StringWithAggregatesFilter<"GameDeposit"> | string
    userId?: StringWithAggregatesFilter<"GameDeposit"> | string
    amount?: IntWithAggregatesFilter<"GameDeposit"> | number
    method?: EnumPaymentMethodWithAggregatesFilter<"GameDeposit"> | $Enums.PaymentMethod
    screenshotUrl?: StringWithAggregatesFilter<"GameDeposit"> | string
    status?: EnumGameDepositStatusWithAggregatesFilter<"GameDeposit"> | $Enums.GameDepositStatus
    rejectionReason?: StringNullableWithAggregatesFilter<"GameDeposit"> | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"GameDeposit"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"GameDeposit"> | Date | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"GameDeposit"> | string | null
  }

  export type GameSessionWhereInput = {
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    id?: StringFilter<"GameSession"> | string
    walletId?: StringFilter<"GameSession"> | string
    userId?: StringFilter<"GameSession"> | string
    wagerAmount?: IntFilter<"GameSession"> | number
    finalScore?: IntFilter<"GameSession"> | number
    winAmount?: IntFilter<"GameSession"> | number
    milestones?: JsonFilter<"GameSession">
    startedAt?: DateTimeFilter<"GameSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    completed?: BoolFilter<"GameSession"> | boolean
    wallet?: XOR<GameWalletScalarRelationFilter, GameWalletWhereInput>
  }

  export type GameSessionOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
    milestones?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    completed?: SortOrder
    wallet?: GameWalletOrderByWithRelationInput
    _relevance?: GameSessionOrderByRelevanceInput
  }

  export type GameSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    walletId?: StringFilter<"GameSession"> | string
    userId?: StringFilter<"GameSession"> | string
    wagerAmount?: IntFilter<"GameSession"> | number
    finalScore?: IntFilter<"GameSession"> | number
    winAmount?: IntFilter<"GameSession"> | number
    milestones?: JsonFilter<"GameSession">
    startedAt?: DateTimeFilter<"GameSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    completed?: BoolFilter<"GameSession"> | boolean
    wallet?: XOR<GameWalletScalarRelationFilter, GameWalletWhereInput>
  }, "id">

  export type GameSessionOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
    milestones?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    completed?: SortOrder
    _count?: GameSessionCountOrderByAggregateInput
    _avg?: GameSessionAvgOrderByAggregateInput
    _max?: GameSessionMaxOrderByAggregateInput
    _min?: GameSessionMinOrderByAggregateInput
    _sum?: GameSessionSumOrderByAggregateInput
  }

  export type GameSessionScalarWhereWithAggregatesInput = {
    AND?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    OR?: GameSessionScalarWhereWithAggregatesInput[]
    NOT?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameSession"> | string
    walletId?: StringWithAggregatesFilter<"GameSession"> | string
    userId?: StringWithAggregatesFilter<"GameSession"> | string
    wagerAmount?: IntWithAggregatesFilter<"GameSession"> | number
    finalScore?: IntWithAggregatesFilter<"GameSession"> | number
    winAmount?: IntWithAggregatesFilter<"GameSession"> | number
    milestones?: JsonWithAggregatesFilter<"GameSession">
    startedAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"GameSession"> | Date | string | null
    completed?: BoolWithAggregatesFilter<"GameSession"> | boolean
  }

  export type GameWithdrawalWhereInput = {
    AND?: GameWithdrawalWhereInput | GameWithdrawalWhereInput[]
    OR?: GameWithdrawalWhereInput[]
    NOT?: GameWithdrawalWhereInput | GameWithdrawalWhereInput[]
    id?: StringFilter<"GameWithdrawal"> | string
    walletId?: StringFilter<"GameWithdrawal"> | string
    userId?: StringFilter<"GameWithdrawal"> | string
    amount?: IntFilter<"GameWithdrawal"> | number
    method?: StringFilter<"GameWithdrawal"> | string
    accountNumber?: StringFilter<"GameWithdrawal"> | string
    accountName?: StringFilter<"GameWithdrawal"> | string
    status?: EnumGameWithdrawalStatusFilter<"GameWithdrawal"> | $Enums.GameWithdrawalStatus
    rejectionReason?: StringNullableFilter<"GameWithdrawal"> | string | null
    submittedAt?: DateTimeFilter<"GameWithdrawal"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"GameWithdrawal"> | Date | string | null
    reviewedBy?: StringNullableFilter<"GameWithdrawal"> | string | null
    wallet?: XOR<GameWalletScalarRelationFilter, GameWalletWhereInput>
  }

  export type GameWithdrawalOrderByWithRelationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    accountNumber?: SortOrder
    accountName?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    wallet?: GameWalletOrderByWithRelationInput
    _relevance?: GameWithdrawalOrderByRelevanceInput
  }

  export type GameWithdrawalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameWithdrawalWhereInput | GameWithdrawalWhereInput[]
    OR?: GameWithdrawalWhereInput[]
    NOT?: GameWithdrawalWhereInput | GameWithdrawalWhereInput[]
    walletId?: StringFilter<"GameWithdrawal"> | string
    userId?: StringFilter<"GameWithdrawal"> | string
    amount?: IntFilter<"GameWithdrawal"> | number
    method?: StringFilter<"GameWithdrawal"> | string
    accountNumber?: StringFilter<"GameWithdrawal"> | string
    accountName?: StringFilter<"GameWithdrawal"> | string
    status?: EnumGameWithdrawalStatusFilter<"GameWithdrawal"> | $Enums.GameWithdrawalStatus
    rejectionReason?: StringNullableFilter<"GameWithdrawal"> | string | null
    submittedAt?: DateTimeFilter<"GameWithdrawal"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"GameWithdrawal"> | Date | string | null
    reviewedBy?: StringNullableFilter<"GameWithdrawal"> | string | null
    wallet?: XOR<GameWalletScalarRelationFilter, GameWalletWhereInput>
  }, "id">

  export type GameWithdrawalOrderByWithAggregationInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    accountNumber?: SortOrder
    accountName?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    _count?: GameWithdrawalCountOrderByAggregateInput
    _avg?: GameWithdrawalAvgOrderByAggregateInput
    _max?: GameWithdrawalMaxOrderByAggregateInput
    _min?: GameWithdrawalMinOrderByAggregateInput
    _sum?: GameWithdrawalSumOrderByAggregateInput
  }

  export type GameWithdrawalScalarWhereWithAggregatesInput = {
    AND?: GameWithdrawalScalarWhereWithAggregatesInput | GameWithdrawalScalarWhereWithAggregatesInput[]
    OR?: GameWithdrawalScalarWhereWithAggregatesInput[]
    NOT?: GameWithdrawalScalarWhereWithAggregatesInput | GameWithdrawalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameWithdrawal"> | string
    walletId?: StringWithAggregatesFilter<"GameWithdrawal"> | string
    userId?: StringWithAggregatesFilter<"GameWithdrawal"> | string
    amount?: IntWithAggregatesFilter<"GameWithdrawal"> | number
    method?: StringWithAggregatesFilter<"GameWithdrawal"> | string
    accountNumber?: StringWithAggregatesFilter<"GameWithdrawal"> | string
    accountName?: StringWithAggregatesFilter<"GameWithdrawal"> | string
    status?: EnumGameWithdrawalStatusWithAggregatesFilter<"GameWithdrawal"> | $Enums.GameWithdrawalStatus
    rejectionReason?: StringNullableWithAggregatesFilter<"GameWithdrawal"> | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"GameWithdrawal"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"GameWithdrawal"> | Date | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"GameWithdrawal"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    alerts?: AlertCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    alerts?: AlertUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    alerts?: AlertUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SeekerProfileCreateInput = {
    id?: string
    phone?: string | null
    location?: string | null
    summary?: string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: string | null
    jobType?: string | null
    desiredSalary?: string | null
    remotePref?: string | null
    cvUrl?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfileInput
  }

  export type SeekerProfileUncheckedCreateInput = {
    id?: string
    userId: string
    phone?: string | null
    location?: string | null
    summary?: string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: string | null
    jobType?: string | null
    desiredSalary?: string | null
    remotePref?: string | null
    cvUrl?: string | null
    updatedAt?: Date | string
  }

  export type SeekerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    github?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    desiredSalary?: NullableStringFieldUpdateOperationsInput | string | null
    remotePref?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfileNestedInput
  }

  export type SeekerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    github?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    desiredSalary?: NullableStringFieldUpdateOperationsInput | string | null
    remotePref?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeekerProfileCreateManyInput = {
    id?: string
    userId: string
    phone?: string | null
    location?: string | null
    summary?: string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: string | null
    jobType?: string | null
    desiredSalary?: string | null
    remotePref?: string | null
    cvUrl?: string | null
    updatedAt?: Date | string
  }

  export type SeekerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    github?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    desiredSalary?: NullableStringFieldUpdateOperationsInput | string | null
    remotePref?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeekerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    github?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    desiredSalary?: NullableStringFieldUpdateOperationsInput | string | null
    remotePref?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutJobInput
    savedBy?: SavedJobCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutJobInput
    savedBy?: SavedJobUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutJobNestedInput
    savedBy?: SavedJobUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutJobNestedInput
    savedBy?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateManyInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateInput = {
    id?: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    job: JobCreateNestedOneWithoutApplicationsInput
    payment?: PaymentCreateNestedOneWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: string
    userId: string
    jobId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payment?: PaymentUncheckedCreateNestedOneWithoutApplicationInput
  }

  export type ApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    job?: JobUpdateOneRequiredWithoutApplicationsNestedInput
    payment?: PaymentUpdateOneWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUncheckedUpdateOneWithoutApplicationNestedInput
  }

  export type ApplicationCreateManyInput = {
    id?: string
    userId: string
    jobId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    amount: number
    method: $Enums.PaymentMethod
    receiptUrl: string
    receiptRef?: string | null
    status?: $Enums.PaymentStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    application: ApplicationCreateNestedOneWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    applicationId: string
    amount: number
    method: $Enums.PaymentMethod
    receiptUrl: string
    receiptRef?: string | null
    status?: $Enums.PaymentStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    receiptUrl?: StringFieldUpdateOperationsInput | string
    receiptRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    application?: ApplicationUpdateOneRequiredWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    receiptUrl?: StringFieldUpdateOperationsInput | string
    receiptRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentCreateManyInput = {
    id?: string
    applicationId: string
    amount: number
    method: $Enums.PaymentMethod
    receiptUrl: string
    receiptRef?: string | null
    status?: $Enums.PaymentStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    receiptUrl?: StringFieldUpdateOperationsInput | string
    receiptRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    applicationId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    receiptUrl?: StringFieldUpdateOperationsInput | string
    receiptRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentSettingCreateInput = {
    id?: string
    method: string
    phone: string
    name: string
    address?: string | null
    active?: boolean
    updatedAt?: Date | string
  }

  export type PaymentSettingUncheckedCreateInput = {
    id?: string
    method: string
    phone: string
    name: string
    address?: string | null
    active?: boolean
    updatedAt?: Date | string
  }

  export type PaymentSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentSettingCreateManyInput = {
    id?: string
    method: string
    phone: string
    name: string
    address?: string | null
    active?: boolean
    updatedAt?: Date | string
  }

  export type PaymentSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobCreateInput = {
    id?: string
    savedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedJobsInput
    job: JobCreateNestedOneWithoutSavedByInput
  }

  export type SavedJobUncheckedCreateInput = {
    id?: string
    userId: string
    jobId: string
    savedAt?: Date | string
  }

  export type SavedJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedJobsNestedInput
    job?: JobUpdateOneRequiredWithoutSavedByNestedInput
  }

  export type SavedJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobCreateManyInput = {
    id?: string
    userId: string
    jobId: string
    savedAt?: Date | string
  }

  export type SavedJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertCreateInput = {
    id?: string
    keywords: string
    location?: string
    type?: string
    frequency?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAlertsInput
  }

  export type AlertUncheckedCreateInput = {
    id?: string
    userId: string
    keywords: string
    location?: string
    type?: string
    frequency?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAlertsNestedInput
  }

  export type AlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertCreateManyInput = {
    id?: string
    userId: string
    keywords: string
    location?: string
    type?: string
    frequency?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsSummaryCreateInput = {
    id?: string
    date: Date | string
    visitors?: number
    pageViews?: number
    applications?: number
    newUsers?: number
  }

  export type AnalyticsSummaryUncheckedCreateInput = {
    id?: string
    date: Date | string
    visitors?: number
    pageViews?: number
    applications?: number
    newUsers?: number
  }

  export type AnalyticsSummaryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    applications?: IntFieldUpdateOperationsInput | number
    newUsers?: IntFieldUpdateOperationsInput | number
  }

  export type AnalyticsSummaryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    applications?: IntFieldUpdateOperationsInput | number
    newUsers?: IntFieldUpdateOperationsInput | number
  }

  export type AnalyticsSummaryCreateManyInput = {
    id?: string
    date: Date | string
    visitors?: number
    pageViews?: number
    applications?: number
    newUsers?: number
  }

  export type AnalyticsSummaryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    applications?: IntFieldUpdateOperationsInput | number
    newUsers?: IntFieldUpdateOperationsInput | number
  }

  export type AnalyticsSummaryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: IntFieldUpdateOperationsInput | number
    pageViews?: IntFieldUpdateOperationsInput | number
    applications?: IntFieldUpdateOperationsInput | number
    newUsers?: IntFieldUpdateOperationsInput | number
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    body: string
    type?: string
    read?: boolean
    link?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    body: string
    type?: string
    read?: boolean
    link?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    body: string
    type?: string
    read?: boolean
    link?: string | null
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatformSettingCreateInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type PlatformSettingUncheckedCreateInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type PlatformSettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatformSettingUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatformSettingCreateManyInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type PlatformSettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlatformSettingUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameWalletCreateInput = {
    id?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGameWalletInput
    deposits?: GameDepositCreateNestedManyWithoutWalletInput
    sessions?: GameSessionCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalCreateNestedManyWithoutWalletInput
  }

  export type GameWalletUncheckedCreateInput = {
    id?: string
    userId: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: GameDepositUncheckedCreateNestedManyWithoutWalletInput
    sessions?: GameSessionUncheckedCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalUncheckedCreateNestedManyWithoutWalletInput
  }

  export type GameWalletUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGameWalletNestedInput
    deposits?: GameDepositUpdateManyWithoutWalletNestedInput
    sessions?: GameSessionUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: GameDepositUncheckedUpdateManyWithoutWalletNestedInput
    sessions?: GameSessionUncheckedUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletCreateManyInput = {
    id?: string
    userId: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameWalletUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameWalletUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameDepositCreateInput = {
    id?: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status?: $Enums.GameDepositStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    wallet: GameWalletCreateNestedOneWithoutDepositsInput
  }

  export type GameDepositUncheckedCreateInput = {
    id?: string
    walletId: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status?: $Enums.GameDepositStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameDepositUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    wallet?: GameWalletUpdateOneRequiredWithoutDepositsNestedInput
  }

  export type GameDepositUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameDepositCreateManyInput = {
    id?: string
    walletId: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status?: $Enums.GameDepositStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameDepositUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameDepositUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameSessionCreateInput = {
    id?: string
    userId: string
    wagerAmount: number
    finalScore?: number
    winAmount?: number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    endedAt?: Date | string | null
    completed?: boolean
    wallet: GameWalletCreateNestedOneWithoutSessionsInput
  }

  export type GameSessionUncheckedCreateInput = {
    id?: string
    walletId: string
    userId: string
    wagerAmount: number
    finalScore?: number
    winAmount?: number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    endedAt?: Date | string | null
    completed?: boolean
  }

  export type GameSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
    wallet?: GameWalletUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type GameSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameSessionCreateManyInput = {
    id?: string
    walletId: string
    userId: string
    wagerAmount: number
    finalScore?: number
    winAmount?: number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    endedAt?: Date | string | null
    completed?: boolean
  }

  export type GameSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameWithdrawalCreateInput = {
    id?: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status?: $Enums.GameWithdrawalStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    wallet: GameWalletCreateNestedOneWithoutWithdrawalsInput
  }

  export type GameWithdrawalUncheckedCreateInput = {
    id?: string
    walletId: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status?: $Enums.GameWithdrawalStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameWithdrawalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    wallet?: GameWalletUpdateOneRequiredWithoutWithdrawalsNestedInput
  }

  export type GameWithdrawalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameWithdrawalCreateManyInput = {
    id?: string
    walletId: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status?: $Enums.GameWithdrawalStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameWithdrawalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameWithdrawalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    walletId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SeekerProfileNullableScalarRelationFilter = {
    is?: SeekerProfileWhereInput | null
    isNot?: SeekerProfileWhereInput | null
  }

  export type ApplicationListRelationFilter = {
    every?: ApplicationWhereInput
    some?: ApplicationWhereInput
    none?: ApplicationWhereInput
  }

  export type SavedJobListRelationFilter = {
    every?: SavedJobWhereInput
    some?: SavedJobWhereInput
    none?: SavedJobWhereInput
  }

  export type AlertListRelationFilter = {
    every?: AlertWhereInput
    some?: AlertWhereInput
    none?: AlertWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type GameWalletNullableScalarRelationFilter = {
    is?: GameWalletWhereInput | null
    isNot?: GameWalletWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SavedJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
    blocked?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
    blocked?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
    blocked?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SeekerProfileOrderByRelevanceInput = {
    fields: SeekerProfileOrderByRelevanceFieldEnum | SeekerProfileOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SeekerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    summary?: SortOrder
    skills?: SortOrder
    linkedin?: SortOrder
    github?: SortOrder
    portfolio?: SortOrder
    education?: SortOrder
    experience?: SortOrder
    currentProject?: SortOrder
    jobType?: SortOrder
    desiredSalary?: SortOrder
    remotePref?: SortOrder
    cvUrl?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeekerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    summary?: SortOrder
    linkedin?: SortOrder
    github?: SortOrder
    portfolio?: SortOrder
    currentProject?: SortOrder
    jobType?: SortOrder
    desiredSalary?: SortOrder
    remotePref?: SortOrder
    cvUrl?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeekerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    phone?: SortOrder
    location?: SortOrder
    summary?: SortOrder
    linkedin?: SortOrder
    github?: SortOrder
    portfolio?: SortOrder
    currentProject?: SortOrder
    jobType?: SortOrder
    desiredSalary?: SortOrder
    remotePref?: SortOrder
    cvUrl?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[]
    notIn?: $Enums.JobStatus[]
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type JobOrderByRelevanceInput = {
    fields: JobOrderByRelevanceFieldEnum | JobOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type JobCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    type?: SortOrder
    category?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    benefits?: SortOrder
    salaryMin?: SortOrder
    salaryMax?: SortOrder
    deadline?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobAvgOrderByAggregateInput = {
    salaryMin?: SortOrder
    salaryMax?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    type?: SortOrder
    category?: SortOrder
    description?: SortOrder
    salaryMin?: SortOrder
    salaryMax?: SortOrder
    deadline?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    company?: SortOrder
    location?: SortOrder
    type?: SortOrder
    category?: SortOrder
    description?: SortOrder
    salaryMin?: SortOrder
    salaryMax?: SortOrder
    deadline?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobSumOrderByAggregateInput = {
    salaryMin?: SortOrder
    salaryMax?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[]
    notIn?: $Enums.JobStatus[]
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }

  export type EnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[]
    notIn?: $Enums.ApplicationStatus[]
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type JobScalarRelationFilter = {
    is?: JobWhereInput
    isNot?: JobWhereInput
  }

  export type PaymentNullableScalarRelationFilter = {
    is?: PaymentWhereInput | null
    isNot?: PaymentWhereInput | null
  }

  export type ApplicationOrderByRelevanceInput = {
    fields: ApplicationOrderByRelevanceFieldEnum | ApplicationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ApplicationUserIdJobIdCompoundUniqueInput = {
    userId: string
    jobId: string
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    cvUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    cvUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    cvUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[]
    notIn?: $Enums.ApplicationStatus[]
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[]
    notIn?: $Enums.PaymentStatus[]
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type ApplicationScalarRelationFilter = {
    is?: ApplicationWhereInput
    isNot?: ApplicationWhereInput
  }

  export type PaymentOrderByRelevanceInput = {
    fields: PaymentOrderByRelevanceFieldEnum | PaymentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    applicationId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    receiptUrl?: SortOrder
    receiptRef?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    applicationId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    receiptUrl?: SortOrder
    receiptRef?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    applicationId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    receiptUrl?: SortOrder
    receiptRef?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[]
    notIn?: $Enums.PaymentStatus[]
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type PaymentSettingOrderByRelevanceInput = {
    fields: PaymentSettingOrderByRelevanceFieldEnum | PaymentSettingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PaymentSettingCountOrderByAggregateInput = {
    id?: SortOrder
    method?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    address?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    method?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    address?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentSettingMinOrderByAggregateInput = {
    id?: SortOrder
    method?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    address?: SortOrder
    active?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedJobOrderByRelevanceInput = {
    fields: SavedJobOrderByRelevanceFieldEnum | SavedJobOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SavedJobUserIdJobIdCompoundUniqueInput = {
    userId: string
    jobId: string
  }

  export type SavedJobCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedJobMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedJobMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    savedAt?: SortOrder
  }

  export type AlertOrderByRelevanceInput = {
    fields: AlertOrderByRelevanceFieldEnum | AlertOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AlertCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    location?: SortOrder
    type?: SortOrder
    frequency?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    location?: SortOrder
    type?: SortOrder
    frequency?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlertMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    location?: SortOrder
    type?: SortOrder
    frequency?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AnalyticsSummaryOrderByRelevanceInput = {
    fields: AnalyticsSummaryOrderByRelevanceFieldEnum | AnalyticsSummaryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AnalyticsSummaryCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
  }

  export type AnalyticsSummaryAvgOrderByAggregateInput = {
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
  }

  export type AnalyticsSummaryMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
  }

  export type AnalyticsSummaryMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
  }

  export type AnalyticsSummarySumOrderByAggregateInput = {
    visitors?: SortOrder
    pageViews?: SortOrder
    applications?: SortOrder
    newUsers?: SortOrder
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    read?: SortOrder
    link?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    read?: SortOrder
    link?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    read?: SortOrder
    link?: SortOrder
    createdAt?: SortOrder
  }

  export type PlatformSettingOrderByRelevanceInput = {
    fields: PlatformSettingOrderByRelevanceFieldEnum | PlatformSettingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PlatformSettingCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlatformSettingMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlatformSettingMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameDepositListRelationFilter = {
    every?: GameDepositWhereInput
    some?: GameDepositWhereInput
    none?: GameDepositWhereInput
  }

  export type GameSessionListRelationFilter = {
    every?: GameSessionWhereInput
    some?: GameSessionWhereInput
    none?: GameSessionWhereInput
  }

  export type GameWithdrawalListRelationFilter = {
    every?: GameWithdrawalWhereInput
    some?: GameWithdrawalWhereInput
    none?: GameWithdrawalWhereInput
  }

  export type GameDepositOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameWithdrawalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameWalletOrderByRelevanceInput = {
    fields: GameWalletOrderByRelevanceFieldEnum | GameWalletOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GameWalletCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameWalletAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type GameWalletMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameWalletMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameWalletSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type EnumGameDepositStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameDepositStatus | EnumGameDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameDepositStatus[]
    notIn?: $Enums.GameDepositStatus[]
    not?: NestedEnumGameDepositStatusFilter<$PrismaModel> | $Enums.GameDepositStatus
  }

  export type GameWalletScalarRelationFilter = {
    is?: GameWalletWhereInput
    isNot?: GameWalletWhereInput
  }

  export type GameDepositOrderByRelevanceInput = {
    fields: GameDepositOrderByRelevanceFieldEnum | GameDepositOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GameDepositCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    screenshotUrl?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type GameDepositAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type GameDepositMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    screenshotUrl?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type GameDepositMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    screenshotUrl?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type GameDepositSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumGameDepositStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameDepositStatus | EnumGameDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameDepositStatus[]
    notIn?: $Enums.GameDepositStatus[]
    not?: NestedEnumGameDepositStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameDepositStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameDepositStatusFilter<$PrismaModel>
    _max?: NestedEnumGameDepositStatusFilter<$PrismaModel>
  }

  export type GameSessionOrderByRelevanceInput = {
    fields: GameSessionOrderByRelevanceFieldEnum | GameSessionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GameSessionCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
    milestones?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    completed?: SortOrder
  }

  export type GameSessionAvgOrderByAggregateInput = {
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
  }

  export type GameSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    completed?: SortOrder
  }

  export type GameSessionMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    completed?: SortOrder
  }

  export type GameSessionSumOrderByAggregateInput = {
    wagerAmount?: SortOrder
    finalScore?: SortOrder
    winAmount?: SortOrder
  }

  export type EnumGameWithdrawalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameWithdrawalStatus | EnumGameWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameWithdrawalStatus[]
    notIn?: $Enums.GameWithdrawalStatus[]
    not?: NestedEnumGameWithdrawalStatusFilter<$PrismaModel> | $Enums.GameWithdrawalStatus
  }

  export type GameWithdrawalOrderByRelevanceInput = {
    fields: GameWithdrawalOrderByRelevanceFieldEnum | GameWithdrawalOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GameWithdrawalCountOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    accountNumber?: SortOrder
    accountName?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type GameWithdrawalAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type GameWithdrawalMaxOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    accountNumber?: SortOrder
    accountName?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type GameWithdrawalMinOrderByAggregateInput = {
    id?: SortOrder
    walletId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    accountNumber?: SortOrder
    accountName?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    submittedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
  }

  export type GameWithdrawalSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumGameWithdrawalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameWithdrawalStatus | EnumGameWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameWithdrawalStatus[]
    notIn?: $Enums.GameWithdrawalStatus[]
    not?: NestedEnumGameWithdrawalStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameWithdrawalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameWithdrawalStatusFilter<$PrismaModel>
    _max?: NestedEnumGameWithdrawalStatusFilter<$PrismaModel>
  }

  export type SeekerProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<SeekerProfileCreateWithoutUserInput, SeekerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: SeekerProfileCreateOrConnectWithoutUserInput
    connect?: SeekerProfileWhereUniqueInput
  }

  export type ApplicationCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type SavedJobCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type AlertCreateNestedManyWithoutUserInput = {
    create?: XOR<AlertCreateWithoutUserInput, AlertUncheckedCreateWithoutUserInput> | AlertCreateWithoutUserInput[] | AlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutUserInput | AlertCreateOrConnectWithoutUserInput[]
    createMany?: AlertCreateManyUserInputEnvelope
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type GameWalletCreateNestedOneWithoutUserInput = {
    create?: XOR<GameWalletCreateWithoutUserInput, GameWalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutUserInput
    connect?: GameWalletWhereUniqueInput
  }

  export type SeekerProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SeekerProfileCreateWithoutUserInput, SeekerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: SeekerProfileCreateOrConnectWithoutUserInput
    connect?: SeekerProfileWhereUniqueInput
  }

  export type ApplicationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type SavedJobUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type AlertUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AlertCreateWithoutUserInput, AlertUncheckedCreateWithoutUserInput> | AlertCreateWithoutUserInput[] | AlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutUserInput | AlertCreateOrConnectWithoutUserInput[]
    createMany?: AlertCreateManyUserInputEnvelope
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type GameWalletUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<GameWalletCreateWithoutUserInput, GameWalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutUserInput
    connect?: GameWalletWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SeekerProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<SeekerProfileCreateWithoutUserInput, SeekerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: SeekerProfileCreateOrConnectWithoutUserInput
    upsert?: SeekerProfileUpsertWithoutUserInput
    disconnect?: SeekerProfileWhereInput | boolean
    delete?: SeekerProfileWhereInput | boolean
    connect?: SeekerProfileWhereUniqueInput
    update?: XOR<XOR<SeekerProfileUpdateToOneWithWhereWithoutUserInput, SeekerProfileUpdateWithoutUserInput>, SeekerProfileUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutUserInput | ApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutUserInput | ApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutUserInput | ApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type SavedJobUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutUserInput | SavedJobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutUserInput | SavedJobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutUserInput | SavedJobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type AlertUpdateManyWithoutUserNestedInput = {
    create?: XOR<AlertCreateWithoutUserInput, AlertUncheckedCreateWithoutUserInput> | AlertCreateWithoutUserInput[] | AlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutUserInput | AlertCreateOrConnectWithoutUserInput[]
    upsert?: AlertUpsertWithWhereUniqueWithoutUserInput | AlertUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AlertCreateManyUserInputEnvelope
    set?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    disconnect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    delete?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    update?: AlertUpdateWithWhereUniqueWithoutUserInput | AlertUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AlertUpdateManyWithWhereWithoutUserInput | AlertUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AlertScalarWhereInput | AlertScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type GameWalletUpdateOneWithoutUserNestedInput = {
    create?: XOR<GameWalletCreateWithoutUserInput, GameWalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutUserInput
    upsert?: GameWalletUpsertWithoutUserInput
    disconnect?: GameWalletWhereInput | boolean
    delete?: GameWalletWhereInput | boolean
    connect?: GameWalletWhereUniqueInput
    update?: XOR<XOR<GameWalletUpdateToOneWithWhereWithoutUserInput, GameWalletUpdateWithoutUserInput>, GameWalletUncheckedUpdateWithoutUserInput>
  }

  export type SeekerProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SeekerProfileCreateWithoutUserInput, SeekerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: SeekerProfileCreateOrConnectWithoutUserInput
    upsert?: SeekerProfileUpsertWithoutUserInput
    disconnect?: SeekerProfileWhereInput | boolean
    delete?: SeekerProfileWhereInput | boolean
    connect?: SeekerProfileWhereUniqueInput
    update?: XOR<XOR<SeekerProfileUpdateToOneWithWhereWithoutUserInput, SeekerProfileUpdateWithoutUserInput>, SeekerProfileUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutUserInput | ApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutUserInput | ApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutUserInput | ApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type SavedJobUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput> | SavedJobCreateWithoutUserInput[] | SavedJobUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutUserInput | SavedJobCreateOrConnectWithoutUserInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutUserInput | SavedJobUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedJobCreateManyUserInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutUserInput | SavedJobUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutUserInput | SavedJobUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type AlertUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AlertCreateWithoutUserInput, AlertUncheckedCreateWithoutUserInput> | AlertCreateWithoutUserInput[] | AlertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AlertCreateOrConnectWithoutUserInput | AlertCreateOrConnectWithoutUserInput[]
    upsert?: AlertUpsertWithWhereUniqueWithoutUserInput | AlertUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AlertCreateManyUserInputEnvelope
    set?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    disconnect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    delete?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    connect?: AlertWhereUniqueInput | AlertWhereUniqueInput[]
    update?: AlertUpdateWithWhereUniqueWithoutUserInput | AlertUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AlertUpdateManyWithWhereWithoutUserInput | AlertUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AlertScalarWhereInput | AlertScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type GameWalletUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<GameWalletCreateWithoutUserInput, GameWalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutUserInput
    upsert?: GameWalletUpsertWithoutUserInput
    disconnect?: GameWalletWhereInput | boolean
    delete?: GameWalletWhereInput | boolean
    connect?: GameWalletWhereUniqueInput
    update?: XOR<XOR<GameWalletUpdateToOneWithWhereWithoutUserInput, GameWalletUpdateWithoutUserInput>, GameWalletUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    upsert?: UserUpsertWithoutProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfileInput, UserUpdateWithoutProfileInput>, UserUncheckedUpdateWithoutProfileInput>
  }

  export type ApplicationCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type SavedJobCreateNestedManyWithoutJobInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type SavedJobUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.JobStatus
  }

  export type ApplicationUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutJobInput | ApplicationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutJobInput | ApplicationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutJobInput | ApplicationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type SavedJobUpdateManyWithoutJobNestedInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutJobInput | SavedJobUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutJobInput | SavedJobUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutJobInput | SavedJobUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutJobInput | ApplicationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutJobInput | ApplicationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutJobInput | ApplicationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type SavedJobUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput> | SavedJobCreateWithoutJobInput[] | SavedJobUncheckedCreateWithoutJobInput[]
    connectOrCreate?: SavedJobCreateOrConnectWithoutJobInput | SavedJobCreateOrConnectWithoutJobInput[]
    upsert?: SavedJobUpsertWithWhereUniqueWithoutJobInput | SavedJobUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: SavedJobCreateManyJobInputEnvelope
    set?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    disconnect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    delete?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    connect?: SavedJobWhereUniqueInput | SavedJobWhereUniqueInput[]
    update?: SavedJobUpdateWithWhereUniqueWithoutJobInput | SavedJobUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: SavedJobUpdateManyWithWhereWithoutJobInput | SavedJobUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplicationsInput
    connect?: JobWhereUniqueInput
  }

  export type PaymentCreateNestedOneWithoutApplicationInput = {
    create?: XOR<PaymentCreateWithoutApplicationInput, PaymentUncheckedCreateWithoutApplicationInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutApplicationInput
    connect?: PaymentWhereUniqueInput
  }

  export type PaymentUncheckedCreateNestedOneWithoutApplicationInput = {
    create?: XOR<PaymentCreateWithoutApplicationInput, PaymentUncheckedCreateWithoutApplicationInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutApplicationInput
    connect?: PaymentWhereUniqueInput
  }

  export type EnumApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApplicationStatus
  }

  export type UserUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    upsert?: UserUpsertWithoutApplicationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApplicationsInput, UserUpdateWithoutApplicationsInput>, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplicationsInput
    upsert?: JobUpsertWithoutApplicationsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutApplicationsInput, JobUpdateWithoutApplicationsInput>, JobUncheckedUpdateWithoutApplicationsInput>
  }

  export type PaymentUpdateOneWithoutApplicationNestedInput = {
    create?: XOR<PaymentCreateWithoutApplicationInput, PaymentUncheckedCreateWithoutApplicationInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutApplicationInput
    upsert?: PaymentUpsertWithoutApplicationInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutApplicationInput, PaymentUpdateWithoutApplicationInput>, PaymentUncheckedUpdateWithoutApplicationInput>
  }

  export type PaymentUncheckedUpdateOneWithoutApplicationNestedInput = {
    create?: XOR<PaymentCreateWithoutApplicationInput, PaymentUncheckedCreateWithoutApplicationInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutApplicationInput
    upsert?: PaymentUpsertWithoutApplicationInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutApplicationInput, PaymentUpdateWithoutApplicationInput>, PaymentUncheckedUpdateWithoutApplicationInput>
  }

  export type ApplicationCreateNestedOneWithoutPaymentInput = {
    create?: XOR<ApplicationCreateWithoutPaymentInput, ApplicationUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutPaymentInput
    connect?: ApplicationWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type ApplicationUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: XOR<ApplicationCreateWithoutPaymentInput, ApplicationUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutPaymentInput
    upsert?: ApplicationUpsertWithoutPaymentInput
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutPaymentInput, ApplicationUpdateWithoutPaymentInput>, ApplicationUncheckedUpdateWithoutPaymentInput>
  }

  export type UserCreateNestedOneWithoutSavedJobsInput = {
    create?: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedJobsInput
    connect?: UserWhereUniqueInput
  }

  export type JobCreateNestedOneWithoutSavedByInput = {
    create?: XOR<JobCreateWithoutSavedByInput, JobUncheckedCreateWithoutSavedByInput>
    connectOrCreate?: JobCreateOrConnectWithoutSavedByInput
    connect?: JobWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedJobsNestedInput = {
    create?: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedJobsInput
    upsert?: UserUpsertWithoutSavedJobsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedJobsInput, UserUpdateWithoutSavedJobsInput>, UserUncheckedUpdateWithoutSavedJobsInput>
  }

  export type JobUpdateOneRequiredWithoutSavedByNestedInput = {
    create?: XOR<JobCreateWithoutSavedByInput, JobUncheckedCreateWithoutSavedByInput>
    connectOrCreate?: JobCreateOrConnectWithoutSavedByInput
    upsert?: JobUpsertWithoutSavedByInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutSavedByInput, JobUpdateWithoutSavedByInput>, JobUncheckedUpdateWithoutSavedByInput>
  }

  export type UserCreateNestedOneWithoutAlertsInput = {
    create?: XOR<UserCreateWithoutAlertsInput, UserUncheckedCreateWithoutAlertsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAlertsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAlertsNestedInput = {
    create?: XOR<UserCreateWithoutAlertsInput, UserUncheckedCreateWithoutAlertsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAlertsInput
    upsert?: UserUpsertWithoutAlertsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAlertsInput, UserUpdateWithoutAlertsInput>, UserUncheckedUpdateWithoutAlertsInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserCreateNestedOneWithoutGameWalletInput = {
    create?: XOR<UserCreateWithoutGameWalletInput, UserUncheckedCreateWithoutGameWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutGameWalletInput
    connect?: UserWhereUniqueInput
  }

  export type GameDepositCreateNestedManyWithoutWalletInput = {
    create?: XOR<GameDepositCreateWithoutWalletInput, GameDepositUncheckedCreateWithoutWalletInput> | GameDepositCreateWithoutWalletInput[] | GameDepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameDepositCreateOrConnectWithoutWalletInput | GameDepositCreateOrConnectWithoutWalletInput[]
    createMany?: GameDepositCreateManyWalletInputEnvelope
    connect?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
  }

  export type GameSessionCreateNestedManyWithoutWalletInput = {
    create?: XOR<GameSessionCreateWithoutWalletInput, GameSessionUncheckedCreateWithoutWalletInput> | GameSessionCreateWithoutWalletInput[] | GameSessionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameSessionCreateOrConnectWithoutWalletInput | GameSessionCreateOrConnectWithoutWalletInput[]
    createMany?: GameSessionCreateManyWalletInputEnvelope
    connect?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
  }

  export type GameWithdrawalCreateNestedManyWithoutWalletInput = {
    create?: XOR<GameWithdrawalCreateWithoutWalletInput, GameWithdrawalUncheckedCreateWithoutWalletInput> | GameWithdrawalCreateWithoutWalletInput[] | GameWithdrawalUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameWithdrawalCreateOrConnectWithoutWalletInput | GameWithdrawalCreateOrConnectWithoutWalletInput[]
    createMany?: GameWithdrawalCreateManyWalletInputEnvelope
    connect?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
  }

  export type GameDepositUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<GameDepositCreateWithoutWalletInput, GameDepositUncheckedCreateWithoutWalletInput> | GameDepositCreateWithoutWalletInput[] | GameDepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameDepositCreateOrConnectWithoutWalletInput | GameDepositCreateOrConnectWithoutWalletInput[]
    createMany?: GameDepositCreateManyWalletInputEnvelope
    connect?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
  }

  export type GameSessionUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<GameSessionCreateWithoutWalletInput, GameSessionUncheckedCreateWithoutWalletInput> | GameSessionCreateWithoutWalletInput[] | GameSessionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameSessionCreateOrConnectWithoutWalletInput | GameSessionCreateOrConnectWithoutWalletInput[]
    createMany?: GameSessionCreateManyWalletInputEnvelope
    connect?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
  }

  export type GameWithdrawalUncheckedCreateNestedManyWithoutWalletInput = {
    create?: XOR<GameWithdrawalCreateWithoutWalletInput, GameWithdrawalUncheckedCreateWithoutWalletInput> | GameWithdrawalCreateWithoutWalletInput[] | GameWithdrawalUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameWithdrawalCreateOrConnectWithoutWalletInput | GameWithdrawalCreateOrConnectWithoutWalletInput[]
    createMany?: GameWithdrawalCreateManyWalletInputEnvelope
    connect?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutGameWalletNestedInput = {
    create?: XOR<UserCreateWithoutGameWalletInput, UserUncheckedCreateWithoutGameWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutGameWalletInput
    upsert?: UserUpsertWithoutGameWalletInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGameWalletInput, UserUpdateWithoutGameWalletInput>, UserUncheckedUpdateWithoutGameWalletInput>
  }

  export type GameDepositUpdateManyWithoutWalletNestedInput = {
    create?: XOR<GameDepositCreateWithoutWalletInput, GameDepositUncheckedCreateWithoutWalletInput> | GameDepositCreateWithoutWalletInput[] | GameDepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameDepositCreateOrConnectWithoutWalletInput | GameDepositCreateOrConnectWithoutWalletInput[]
    upsert?: GameDepositUpsertWithWhereUniqueWithoutWalletInput | GameDepositUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: GameDepositCreateManyWalletInputEnvelope
    set?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    disconnect?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    delete?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    connect?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    update?: GameDepositUpdateWithWhereUniqueWithoutWalletInput | GameDepositUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: GameDepositUpdateManyWithWhereWithoutWalletInput | GameDepositUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: GameDepositScalarWhereInput | GameDepositScalarWhereInput[]
  }

  export type GameSessionUpdateManyWithoutWalletNestedInput = {
    create?: XOR<GameSessionCreateWithoutWalletInput, GameSessionUncheckedCreateWithoutWalletInput> | GameSessionCreateWithoutWalletInput[] | GameSessionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameSessionCreateOrConnectWithoutWalletInput | GameSessionCreateOrConnectWithoutWalletInput[]
    upsert?: GameSessionUpsertWithWhereUniqueWithoutWalletInput | GameSessionUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: GameSessionCreateManyWalletInputEnvelope
    set?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    disconnect?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    delete?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    connect?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    update?: GameSessionUpdateWithWhereUniqueWithoutWalletInput | GameSessionUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: GameSessionUpdateManyWithWhereWithoutWalletInput | GameSessionUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: GameSessionScalarWhereInput | GameSessionScalarWhereInput[]
  }

  export type GameWithdrawalUpdateManyWithoutWalletNestedInput = {
    create?: XOR<GameWithdrawalCreateWithoutWalletInput, GameWithdrawalUncheckedCreateWithoutWalletInput> | GameWithdrawalCreateWithoutWalletInput[] | GameWithdrawalUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameWithdrawalCreateOrConnectWithoutWalletInput | GameWithdrawalCreateOrConnectWithoutWalletInput[]
    upsert?: GameWithdrawalUpsertWithWhereUniqueWithoutWalletInput | GameWithdrawalUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: GameWithdrawalCreateManyWalletInputEnvelope
    set?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    disconnect?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    delete?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    connect?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    update?: GameWithdrawalUpdateWithWhereUniqueWithoutWalletInput | GameWithdrawalUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: GameWithdrawalUpdateManyWithWhereWithoutWalletInput | GameWithdrawalUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: GameWithdrawalScalarWhereInput | GameWithdrawalScalarWhereInput[]
  }

  export type GameDepositUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<GameDepositCreateWithoutWalletInput, GameDepositUncheckedCreateWithoutWalletInput> | GameDepositCreateWithoutWalletInput[] | GameDepositUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameDepositCreateOrConnectWithoutWalletInput | GameDepositCreateOrConnectWithoutWalletInput[]
    upsert?: GameDepositUpsertWithWhereUniqueWithoutWalletInput | GameDepositUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: GameDepositCreateManyWalletInputEnvelope
    set?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    disconnect?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    delete?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    connect?: GameDepositWhereUniqueInput | GameDepositWhereUniqueInput[]
    update?: GameDepositUpdateWithWhereUniqueWithoutWalletInput | GameDepositUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: GameDepositUpdateManyWithWhereWithoutWalletInput | GameDepositUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: GameDepositScalarWhereInput | GameDepositScalarWhereInput[]
  }

  export type GameSessionUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<GameSessionCreateWithoutWalletInput, GameSessionUncheckedCreateWithoutWalletInput> | GameSessionCreateWithoutWalletInput[] | GameSessionUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameSessionCreateOrConnectWithoutWalletInput | GameSessionCreateOrConnectWithoutWalletInput[]
    upsert?: GameSessionUpsertWithWhereUniqueWithoutWalletInput | GameSessionUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: GameSessionCreateManyWalletInputEnvelope
    set?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    disconnect?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    delete?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    connect?: GameSessionWhereUniqueInput | GameSessionWhereUniqueInput[]
    update?: GameSessionUpdateWithWhereUniqueWithoutWalletInput | GameSessionUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: GameSessionUpdateManyWithWhereWithoutWalletInput | GameSessionUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: GameSessionScalarWhereInput | GameSessionScalarWhereInput[]
  }

  export type GameWithdrawalUncheckedUpdateManyWithoutWalletNestedInput = {
    create?: XOR<GameWithdrawalCreateWithoutWalletInput, GameWithdrawalUncheckedCreateWithoutWalletInput> | GameWithdrawalCreateWithoutWalletInput[] | GameWithdrawalUncheckedCreateWithoutWalletInput[]
    connectOrCreate?: GameWithdrawalCreateOrConnectWithoutWalletInput | GameWithdrawalCreateOrConnectWithoutWalletInput[]
    upsert?: GameWithdrawalUpsertWithWhereUniqueWithoutWalletInput | GameWithdrawalUpsertWithWhereUniqueWithoutWalletInput[]
    createMany?: GameWithdrawalCreateManyWalletInputEnvelope
    set?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    disconnect?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    delete?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    connect?: GameWithdrawalWhereUniqueInput | GameWithdrawalWhereUniqueInput[]
    update?: GameWithdrawalUpdateWithWhereUniqueWithoutWalletInput | GameWithdrawalUpdateWithWhereUniqueWithoutWalletInput[]
    updateMany?: GameWithdrawalUpdateManyWithWhereWithoutWalletInput | GameWithdrawalUpdateManyWithWhereWithoutWalletInput[]
    deleteMany?: GameWithdrawalScalarWhereInput | GameWithdrawalScalarWhereInput[]
  }

  export type GameWalletCreateNestedOneWithoutDepositsInput = {
    create?: XOR<GameWalletCreateWithoutDepositsInput, GameWalletUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutDepositsInput
    connect?: GameWalletWhereUniqueInput
  }

  export type EnumGameDepositStatusFieldUpdateOperationsInput = {
    set?: $Enums.GameDepositStatus
  }

  export type GameWalletUpdateOneRequiredWithoutDepositsNestedInput = {
    create?: XOR<GameWalletCreateWithoutDepositsInput, GameWalletUncheckedCreateWithoutDepositsInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutDepositsInput
    upsert?: GameWalletUpsertWithoutDepositsInput
    connect?: GameWalletWhereUniqueInput
    update?: XOR<XOR<GameWalletUpdateToOneWithWhereWithoutDepositsInput, GameWalletUpdateWithoutDepositsInput>, GameWalletUncheckedUpdateWithoutDepositsInput>
  }

  export type GameWalletCreateNestedOneWithoutSessionsInput = {
    create?: XOR<GameWalletCreateWithoutSessionsInput, GameWalletUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutSessionsInput
    connect?: GameWalletWhereUniqueInput
  }

  export type GameWalletUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<GameWalletCreateWithoutSessionsInput, GameWalletUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutSessionsInput
    upsert?: GameWalletUpsertWithoutSessionsInput
    connect?: GameWalletWhereUniqueInput
    update?: XOR<XOR<GameWalletUpdateToOneWithWhereWithoutSessionsInput, GameWalletUpdateWithoutSessionsInput>, GameWalletUncheckedUpdateWithoutSessionsInput>
  }

  export type GameWalletCreateNestedOneWithoutWithdrawalsInput = {
    create?: XOR<GameWalletCreateWithoutWithdrawalsInput, GameWalletUncheckedCreateWithoutWithdrawalsInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutWithdrawalsInput
    connect?: GameWalletWhereUniqueInput
  }

  export type EnumGameWithdrawalStatusFieldUpdateOperationsInput = {
    set?: $Enums.GameWithdrawalStatus
  }

  export type GameWalletUpdateOneRequiredWithoutWithdrawalsNestedInput = {
    create?: XOR<GameWalletCreateWithoutWithdrawalsInput, GameWalletUncheckedCreateWithoutWithdrawalsInput>
    connectOrCreate?: GameWalletCreateOrConnectWithoutWithdrawalsInput
    upsert?: GameWalletUpsertWithoutWithdrawalsInput
    connect?: GameWalletWhereUniqueInput
    update?: XOR<XOR<GameWalletUpdateToOneWithWhereWithoutWithdrawalsInput, GameWalletUpdateWithoutWithdrawalsInput>, GameWalletUncheckedUpdateWithoutWithdrawalsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[]
    notIn?: $Enums.JobStatus[]
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[]
    notIn?: $Enums.JobStatus[]
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }

  export type NestedEnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[]
    notIn?: $Enums.ApplicationStatus[]
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[]
    notIn?: $Enums.ApplicationStatus[]
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[]
    notIn?: $Enums.PaymentStatus[]
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[]
    notIn?: $Enums.PaymentMethod[]
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[]
    notIn?: $Enums.PaymentStatus[]
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumGameDepositStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameDepositStatus | EnumGameDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameDepositStatus[]
    notIn?: $Enums.GameDepositStatus[]
    not?: NestedEnumGameDepositStatusFilter<$PrismaModel> | $Enums.GameDepositStatus
  }

  export type NestedEnumGameDepositStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameDepositStatus | EnumGameDepositStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameDepositStatus[]
    notIn?: $Enums.GameDepositStatus[]
    not?: NestedEnumGameDepositStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameDepositStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameDepositStatusFilter<$PrismaModel>
    _max?: NestedEnumGameDepositStatusFilter<$PrismaModel>
  }

  export type NestedEnumGameWithdrawalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameWithdrawalStatus | EnumGameWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameWithdrawalStatus[]
    notIn?: $Enums.GameWithdrawalStatus[]
    not?: NestedEnumGameWithdrawalStatusFilter<$PrismaModel> | $Enums.GameWithdrawalStatus
  }

  export type NestedEnumGameWithdrawalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameWithdrawalStatus | EnumGameWithdrawalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameWithdrawalStatus[]
    notIn?: $Enums.GameWithdrawalStatus[]
    not?: NestedEnumGameWithdrawalStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameWithdrawalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameWithdrawalStatusFilter<$PrismaModel>
    _max?: NestedEnumGameWithdrawalStatusFilter<$PrismaModel>
  }

  export type SeekerProfileCreateWithoutUserInput = {
    id?: string
    phone?: string | null
    location?: string | null
    summary?: string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: string | null
    jobType?: string | null
    desiredSalary?: string | null
    remotePref?: string | null
    cvUrl?: string | null
    updatedAt?: Date | string
  }

  export type SeekerProfileUncheckedCreateWithoutUserInput = {
    id?: string
    phone?: string | null
    location?: string | null
    summary?: string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: string | null
    github?: string | null
    portfolio?: string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: string | null
    jobType?: string | null
    desiredSalary?: string | null
    remotePref?: string | null
    cvUrl?: string | null
    updatedAt?: Date | string
  }

  export type SeekerProfileCreateOrConnectWithoutUserInput = {
    where: SeekerProfileWhereUniqueInput
    create: XOR<SeekerProfileCreateWithoutUserInput, SeekerProfileUncheckedCreateWithoutUserInput>
  }

  export type ApplicationCreateWithoutUserInput = {
    id?: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    job: JobCreateNestedOneWithoutApplicationsInput
    payment?: PaymentCreateNestedOneWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutUserInput = {
    id?: string
    jobId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payment?: PaymentUncheckedCreateNestedOneWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput>
  }

  export type ApplicationCreateManyUserInputEnvelope = {
    data: ApplicationCreateManyUserInput | ApplicationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SavedJobCreateWithoutUserInput = {
    id?: string
    savedAt?: Date | string
    job: JobCreateNestedOneWithoutSavedByInput
  }

  export type SavedJobUncheckedCreateWithoutUserInput = {
    id?: string
    jobId: string
    savedAt?: Date | string
  }

  export type SavedJobCreateOrConnectWithoutUserInput = {
    where: SavedJobWhereUniqueInput
    create: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput>
  }

  export type SavedJobCreateManyUserInputEnvelope = {
    data: SavedJobCreateManyUserInput | SavedJobCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AlertCreateWithoutUserInput = {
    id?: string
    keywords: string
    location?: string
    type?: string
    frequency?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertUncheckedCreateWithoutUserInput = {
    id?: string
    keywords: string
    location?: string
    type?: string
    frequency?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlertCreateOrConnectWithoutUserInput = {
    where: AlertWhereUniqueInput
    create: XOR<AlertCreateWithoutUserInput, AlertUncheckedCreateWithoutUserInput>
  }

  export type AlertCreateManyUserInputEnvelope = {
    data: AlertCreateManyUserInput | AlertCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    type?: string
    read?: boolean
    link?: string | null
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    type?: string
    read?: boolean
    link?: string | null
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GameWalletCreateWithoutUserInput = {
    id?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: GameDepositCreateNestedManyWithoutWalletInput
    sessions?: GameSessionCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalCreateNestedManyWithoutWalletInput
  }

  export type GameWalletUncheckedCreateWithoutUserInput = {
    id?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: GameDepositUncheckedCreateNestedManyWithoutWalletInput
    sessions?: GameSessionUncheckedCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalUncheckedCreateNestedManyWithoutWalletInput
  }

  export type GameWalletCreateOrConnectWithoutUserInput = {
    where: GameWalletWhereUniqueInput
    create: XOR<GameWalletCreateWithoutUserInput, GameWalletUncheckedCreateWithoutUserInput>
  }

  export type SeekerProfileUpsertWithoutUserInput = {
    update: XOR<SeekerProfileUpdateWithoutUserInput, SeekerProfileUncheckedUpdateWithoutUserInput>
    create: XOR<SeekerProfileCreateWithoutUserInput, SeekerProfileUncheckedCreateWithoutUserInput>
    where?: SeekerProfileWhereInput
  }

  export type SeekerProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: SeekerProfileWhereInput
    data: XOR<SeekerProfileUpdateWithoutUserInput, SeekerProfileUncheckedUpdateWithoutUserInput>
  }

  export type SeekerProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    github?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    desiredSalary?: NullableStringFieldUpdateOperationsInput | string | null
    remotePref?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeekerProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: JsonNullValueInput | InputJsonValue
    linkedin?: NullableStringFieldUpdateOperationsInput | string | null
    github?: NullableStringFieldUpdateOperationsInput | string | null
    portfolio?: NullableStringFieldUpdateOperationsInput | string | null
    education?: JsonNullValueInput | InputJsonValue
    experience?: JsonNullValueInput | InputJsonValue
    currentProject?: NullableStringFieldUpdateOperationsInput | string | null
    jobType?: NullableStringFieldUpdateOperationsInput | string | null
    desiredSalary?: NullableStringFieldUpdateOperationsInput | string | null
    remotePref?: NullableStringFieldUpdateOperationsInput | string | null
    cvUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUpsertWithWhereUniqueWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutUserInput, ApplicationUncheckedUpdateWithoutUserInput>
    create: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutUserInput, ApplicationUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutUserInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutUserInput>
  }

  export type ApplicationScalarWhereInput = {
    AND?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    OR?: ApplicationScalarWhereInput[]
    NOT?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    id?: StringFilter<"Application"> | string
    userId?: StringFilter<"Application"> | string
    jobId?: StringFilter<"Application"> | string
    cvUrl?: StringFilter<"Application"> | string
    status?: EnumApplicationStatusFilter<"Application"> | $Enums.ApplicationStatus
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
  }

  export type SavedJobUpsertWithWhereUniqueWithoutUserInput = {
    where: SavedJobWhereUniqueInput
    update: XOR<SavedJobUpdateWithoutUserInput, SavedJobUncheckedUpdateWithoutUserInput>
    create: XOR<SavedJobCreateWithoutUserInput, SavedJobUncheckedCreateWithoutUserInput>
  }

  export type SavedJobUpdateWithWhereUniqueWithoutUserInput = {
    where: SavedJobWhereUniqueInput
    data: XOR<SavedJobUpdateWithoutUserInput, SavedJobUncheckedUpdateWithoutUserInput>
  }

  export type SavedJobUpdateManyWithWhereWithoutUserInput = {
    where: SavedJobScalarWhereInput
    data: XOR<SavedJobUpdateManyMutationInput, SavedJobUncheckedUpdateManyWithoutUserInput>
  }

  export type SavedJobScalarWhereInput = {
    AND?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
    OR?: SavedJobScalarWhereInput[]
    NOT?: SavedJobScalarWhereInput | SavedJobScalarWhereInput[]
    id?: StringFilter<"SavedJob"> | string
    userId?: StringFilter<"SavedJob"> | string
    jobId?: StringFilter<"SavedJob"> | string
    savedAt?: DateTimeFilter<"SavedJob"> | Date | string
  }

  export type AlertUpsertWithWhereUniqueWithoutUserInput = {
    where: AlertWhereUniqueInput
    update: XOR<AlertUpdateWithoutUserInput, AlertUncheckedUpdateWithoutUserInput>
    create: XOR<AlertCreateWithoutUserInput, AlertUncheckedCreateWithoutUserInput>
  }

  export type AlertUpdateWithWhereUniqueWithoutUserInput = {
    where: AlertWhereUniqueInput
    data: XOR<AlertUpdateWithoutUserInput, AlertUncheckedUpdateWithoutUserInput>
  }

  export type AlertUpdateManyWithWhereWithoutUserInput = {
    where: AlertScalarWhereInput
    data: XOR<AlertUpdateManyMutationInput, AlertUncheckedUpdateManyWithoutUserInput>
  }

  export type AlertScalarWhereInput = {
    AND?: AlertScalarWhereInput | AlertScalarWhereInput[]
    OR?: AlertScalarWhereInput[]
    NOT?: AlertScalarWhereInput | AlertScalarWhereInput[]
    id?: StringFilter<"Alert"> | string
    userId?: StringFilter<"Alert"> | string
    keywords?: StringFilter<"Alert"> | string
    location?: StringFilter<"Alert"> | string
    type?: StringFilter<"Alert"> | string
    frequency?: StringFilter<"Alert"> | string
    active?: BoolFilter<"Alert"> | boolean
    createdAt?: DateTimeFilter<"Alert"> | Date | string
    updatedAt?: DateTimeFilter<"Alert"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    link?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type GameWalletUpsertWithoutUserInput = {
    update: XOR<GameWalletUpdateWithoutUserInput, GameWalletUncheckedUpdateWithoutUserInput>
    create: XOR<GameWalletCreateWithoutUserInput, GameWalletUncheckedCreateWithoutUserInput>
    where?: GameWalletWhereInput
  }

  export type GameWalletUpdateToOneWithWhereWithoutUserInput = {
    where?: GameWalletWhereInput
    data: XOR<GameWalletUpdateWithoutUserInput, GameWalletUncheckedUpdateWithoutUserInput>
  }

  export type GameWalletUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: GameDepositUpdateManyWithoutWalletNestedInput
    sessions?: GameSessionUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: GameDepositUncheckedUpdateManyWithoutWalletNestedInput
    sessions?: GameSessionUncheckedUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type UserCreateWithoutProfileInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    applications?: ApplicationCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    alerts?: AlertCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    alerts?: AlertUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
  }

  export type UserUpsertWithoutProfileInput = {
    update: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    alerts?: AlertUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type ApplicationCreateWithoutJobInput = {
    id?: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    payment?: PaymentCreateNestedOneWithoutApplicationInput
  }

  export type ApplicationUncheckedCreateWithoutJobInput = {
    id?: string
    userId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    payment?: PaymentUncheckedCreateNestedOneWithoutApplicationInput
  }

  export type ApplicationCreateOrConnectWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput>
  }

  export type ApplicationCreateManyJobInputEnvelope = {
    data: ApplicationCreateManyJobInput | ApplicationCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type SavedJobCreateWithoutJobInput = {
    id?: string
    savedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedJobsInput
  }

  export type SavedJobUncheckedCreateWithoutJobInput = {
    id?: string
    userId: string
    savedAt?: Date | string
  }

  export type SavedJobCreateOrConnectWithoutJobInput = {
    where: SavedJobWhereUniqueInput
    create: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput>
  }

  export type SavedJobCreateManyJobInputEnvelope = {
    data: SavedJobCreateManyJobInput | SavedJobCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationUpsertWithWhereUniqueWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutJobInput, ApplicationUncheckedUpdateWithoutJobInput>
    create: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutJobInput, ApplicationUncheckedUpdateWithoutJobInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutJobInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutJobInput>
  }

  export type SavedJobUpsertWithWhereUniqueWithoutJobInput = {
    where: SavedJobWhereUniqueInput
    update: XOR<SavedJobUpdateWithoutJobInput, SavedJobUncheckedUpdateWithoutJobInput>
    create: XOR<SavedJobCreateWithoutJobInput, SavedJobUncheckedCreateWithoutJobInput>
  }

  export type SavedJobUpdateWithWhereUniqueWithoutJobInput = {
    where: SavedJobWhereUniqueInput
    data: XOR<SavedJobUpdateWithoutJobInput, SavedJobUncheckedUpdateWithoutJobInput>
  }

  export type SavedJobUpdateManyWithWhereWithoutJobInput = {
    where: SavedJobScalarWhereInput
    data: XOR<SavedJobUpdateManyMutationInput, SavedJobUncheckedUpdateManyWithoutJobInput>
  }

  export type UserCreateWithoutApplicationsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileCreateNestedOneWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    alerts?: AlertCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApplicationsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileUncheckedCreateNestedOneWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    alerts?: AlertUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
  }

  export type JobCreateWithoutApplicationsInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    savedBy?: SavedJobCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutApplicationsInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    savedBy?: SavedJobUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutApplicationsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
  }

  export type PaymentCreateWithoutApplicationInput = {
    id?: string
    amount: number
    method: $Enums.PaymentMethod
    receiptUrl: string
    receiptRef?: string | null
    status?: $Enums.PaymentStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type PaymentUncheckedCreateWithoutApplicationInput = {
    id?: string
    amount: number
    method: $Enums.PaymentMethod
    receiptUrl: string
    receiptRef?: string | null
    status?: $Enums.PaymentStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type PaymentCreateOrConnectWithoutApplicationInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutApplicationInput, PaymentUncheckedCreateWithoutApplicationInput>
  }

  export type UserUpsertWithoutApplicationsInput = {
    update: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUpdateOneWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    alerts?: AlertUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUncheckedUpdateOneWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type JobUpsertWithoutApplicationsInput = {
    update: XOR<JobUpdateWithoutApplicationsInput, JobUncheckedUpdateWithoutApplicationsInput>
    create: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutApplicationsInput, JobUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedBy?: SavedJobUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedBy?: SavedJobUncheckedUpdateManyWithoutJobNestedInput
  }

  export type PaymentUpsertWithoutApplicationInput = {
    update: XOR<PaymentUpdateWithoutApplicationInput, PaymentUncheckedUpdateWithoutApplicationInput>
    create: XOR<PaymentCreateWithoutApplicationInput, PaymentUncheckedCreateWithoutApplicationInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutApplicationInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutApplicationInput, PaymentUncheckedUpdateWithoutApplicationInput>
  }

  export type PaymentUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    receiptUrl?: StringFieldUpdateOperationsInput | string
    receiptRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateWithoutApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    receiptUrl?: StringFieldUpdateOperationsInput | string
    receiptRef?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ApplicationCreateWithoutPaymentInput = {
    id?: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
    job: JobCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutPaymentInput = {
    id?: string
    userId: string
    jobId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutPaymentInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutPaymentInput, ApplicationUncheckedCreateWithoutPaymentInput>
  }

  export type ApplicationUpsertWithoutPaymentInput = {
    update: XOR<ApplicationUpdateWithoutPaymentInput, ApplicationUncheckedUpdateWithoutPaymentInput>
    create: XOR<ApplicationCreateWithoutPaymentInput, ApplicationUncheckedCreateWithoutPaymentInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutPaymentInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutPaymentInput, ApplicationUncheckedUpdateWithoutPaymentInput>
  }

  export type ApplicationUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    job?: JobUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSavedJobsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
    alerts?: AlertCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedJobsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    alerts?: AlertUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedJobsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
  }

  export type JobCreateWithoutSavedByInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutSavedByInput = {
    id?: string
    title: string
    company: string
    location: string
    type: string
    category: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: number | null
    salaryMax?: number | null
    deadline?: Date | string | null
    status?: $Enums.JobStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutSavedByInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutSavedByInput, JobUncheckedCreateWithoutSavedByInput>
  }

  export type UserUpsertWithoutSavedJobsInput = {
    update: XOR<UserUpdateWithoutSavedJobsInput, UserUncheckedUpdateWithoutSavedJobsInput>
    create: XOR<UserCreateWithoutSavedJobsInput, UserUncheckedCreateWithoutSavedJobsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedJobsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedJobsInput, UserUncheckedUpdateWithoutSavedJobsInput>
  }

  export type UserUpdateWithoutSavedJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    alerts?: AlertUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type JobUpsertWithoutSavedByInput = {
    update: XOR<JobUpdateWithoutSavedByInput, JobUncheckedUpdateWithoutSavedByInput>
    create: XOR<JobCreateWithoutSavedByInput, JobUncheckedCreateWithoutSavedByInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutSavedByInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutSavedByInput, JobUncheckedUpdateWithoutSavedByInput>
  }

  export type JobUpdateWithoutSavedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutSavedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    benefits?: JsonNullValueInput | InputJsonValue
    salaryMin?: NullableIntFieldUpdateOperationsInput | number | null
    salaryMax?: NullableIntFieldUpdateOperationsInput | number | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type UserCreateWithoutAlertsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAlertsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAlertsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAlertsInput, UserUncheckedCreateWithoutAlertsInput>
  }

  export type UserUpsertWithoutAlertsInput = {
    update: XOR<UserUpdateWithoutAlertsInput, UserUncheckedUpdateWithoutAlertsInput>
    create: XOR<UserCreateWithoutAlertsInput, UserUncheckedCreateWithoutAlertsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAlertsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAlertsInput, UserUncheckedUpdateWithoutAlertsInput>
  }

  export type UserUpdateWithoutAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    alerts?: AlertCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    alerts?: AlertUncheckedCreateNestedManyWithoutUserInput
    gameWallet?: GameWalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    alerts?: AlertUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutUserNestedInput
    gameWallet?: GameWalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutGameWalletInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileCreateNestedOneWithoutUserInput
    applications?: ApplicationCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobCreateNestedManyWithoutUserInput
    alerts?: AlertCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGameWalletInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    blocked?: boolean
    profile?: SeekerProfileUncheckedCreateNestedOneWithoutUserInput
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    savedJobs?: SavedJobUncheckedCreateNestedManyWithoutUserInput
    alerts?: AlertUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGameWalletInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGameWalletInput, UserUncheckedCreateWithoutGameWalletInput>
  }

  export type GameDepositCreateWithoutWalletInput = {
    id?: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status?: $Enums.GameDepositStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameDepositUncheckedCreateWithoutWalletInput = {
    id?: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status?: $Enums.GameDepositStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameDepositCreateOrConnectWithoutWalletInput = {
    where: GameDepositWhereUniqueInput
    create: XOR<GameDepositCreateWithoutWalletInput, GameDepositUncheckedCreateWithoutWalletInput>
  }

  export type GameDepositCreateManyWalletInputEnvelope = {
    data: GameDepositCreateManyWalletInput | GameDepositCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type GameSessionCreateWithoutWalletInput = {
    id?: string
    userId: string
    wagerAmount: number
    finalScore?: number
    winAmount?: number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    endedAt?: Date | string | null
    completed?: boolean
  }

  export type GameSessionUncheckedCreateWithoutWalletInput = {
    id?: string
    userId: string
    wagerAmount: number
    finalScore?: number
    winAmount?: number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    endedAt?: Date | string | null
    completed?: boolean
  }

  export type GameSessionCreateOrConnectWithoutWalletInput = {
    where: GameSessionWhereUniqueInput
    create: XOR<GameSessionCreateWithoutWalletInput, GameSessionUncheckedCreateWithoutWalletInput>
  }

  export type GameSessionCreateManyWalletInputEnvelope = {
    data: GameSessionCreateManyWalletInput | GameSessionCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type GameWithdrawalCreateWithoutWalletInput = {
    id?: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status?: $Enums.GameWithdrawalStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameWithdrawalUncheckedCreateWithoutWalletInput = {
    id?: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status?: $Enums.GameWithdrawalStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameWithdrawalCreateOrConnectWithoutWalletInput = {
    where: GameWithdrawalWhereUniqueInput
    create: XOR<GameWithdrawalCreateWithoutWalletInput, GameWithdrawalUncheckedCreateWithoutWalletInput>
  }

  export type GameWithdrawalCreateManyWalletInputEnvelope = {
    data: GameWithdrawalCreateManyWalletInput | GameWithdrawalCreateManyWalletInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGameWalletInput = {
    update: XOR<UserUpdateWithoutGameWalletInput, UserUncheckedUpdateWithoutGameWalletInput>
    create: XOR<UserCreateWithoutGameWalletInput, UserUncheckedCreateWithoutGameWalletInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGameWalletInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGameWalletInput, UserUncheckedUpdateWithoutGameWalletInput>
  }

  export type UserUpdateWithoutGameWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUpdateOneWithoutUserNestedInput
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUpdateManyWithoutUserNestedInput
    alerts?: AlertUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGameWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    blocked?: BoolFieldUpdateOperationsInput | boolean
    profile?: SeekerProfileUncheckedUpdateOneWithoutUserNestedInput
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    savedJobs?: SavedJobUncheckedUpdateManyWithoutUserNestedInput
    alerts?: AlertUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GameDepositUpsertWithWhereUniqueWithoutWalletInput = {
    where: GameDepositWhereUniqueInput
    update: XOR<GameDepositUpdateWithoutWalletInput, GameDepositUncheckedUpdateWithoutWalletInput>
    create: XOR<GameDepositCreateWithoutWalletInput, GameDepositUncheckedCreateWithoutWalletInput>
  }

  export type GameDepositUpdateWithWhereUniqueWithoutWalletInput = {
    where: GameDepositWhereUniqueInput
    data: XOR<GameDepositUpdateWithoutWalletInput, GameDepositUncheckedUpdateWithoutWalletInput>
  }

  export type GameDepositUpdateManyWithWhereWithoutWalletInput = {
    where: GameDepositScalarWhereInput
    data: XOR<GameDepositUpdateManyMutationInput, GameDepositUncheckedUpdateManyWithoutWalletInput>
  }

  export type GameDepositScalarWhereInput = {
    AND?: GameDepositScalarWhereInput | GameDepositScalarWhereInput[]
    OR?: GameDepositScalarWhereInput[]
    NOT?: GameDepositScalarWhereInput | GameDepositScalarWhereInput[]
    id?: StringFilter<"GameDeposit"> | string
    walletId?: StringFilter<"GameDeposit"> | string
    userId?: StringFilter<"GameDeposit"> | string
    amount?: IntFilter<"GameDeposit"> | number
    method?: EnumPaymentMethodFilter<"GameDeposit"> | $Enums.PaymentMethod
    screenshotUrl?: StringFilter<"GameDeposit"> | string
    status?: EnumGameDepositStatusFilter<"GameDeposit"> | $Enums.GameDepositStatus
    rejectionReason?: StringNullableFilter<"GameDeposit"> | string | null
    submittedAt?: DateTimeFilter<"GameDeposit"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"GameDeposit"> | Date | string | null
    reviewedBy?: StringNullableFilter<"GameDeposit"> | string | null
  }

  export type GameSessionUpsertWithWhereUniqueWithoutWalletInput = {
    where: GameSessionWhereUniqueInput
    update: XOR<GameSessionUpdateWithoutWalletInput, GameSessionUncheckedUpdateWithoutWalletInput>
    create: XOR<GameSessionCreateWithoutWalletInput, GameSessionUncheckedCreateWithoutWalletInput>
  }

  export type GameSessionUpdateWithWhereUniqueWithoutWalletInput = {
    where: GameSessionWhereUniqueInput
    data: XOR<GameSessionUpdateWithoutWalletInput, GameSessionUncheckedUpdateWithoutWalletInput>
  }

  export type GameSessionUpdateManyWithWhereWithoutWalletInput = {
    where: GameSessionScalarWhereInput
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyWithoutWalletInput>
  }

  export type GameSessionScalarWhereInput = {
    AND?: GameSessionScalarWhereInput | GameSessionScalarWhereInput[]
    OR?: GameSessionScalarWhereInput[]
    NOT?: GameSessionScalarWhereInput | GameSessionScalarWhereInput[]
    id?: StringFilter<"GameSession"> | string
    walletId?: StringFilter<"GameSession"> | string
    userId?: StringFilter<"GameSession"> | string
    wagerAmount?: IntFilter<"GameSession"> | number
    finalScore?: IntFilter<"GameSession"> | number
    winAmount?: IntFilter<"GameSession"> | number
    milestones?: JsonFilter<"GameSession">
    startedAt?: DateTimeFilter<"GameSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    completed?: BoolFilter<"GameSession"> | boolean
  }

  export type GameWithdrawalUpsertWithWhereUniqueWithoutWalletInput = {
    where: GameWithdrawalWhereUniqueInput
    update: XOR<GameWithdrawalUpdateWithoutWalletInput, GameWithdrawalUncheckedUpdateWithoutWalletInput>
    create: XOR<GameWithdrawalCreateWithoutWalletInput, GameWithdrawalUncheckedCreateWithoutWalletInput>
  }

  export type GameWithdrawalUpdateWithWhereUniqueWithoutWalletInput = {
    where: GameWithdrawalWhereUniqueInput
    data: XOR<GameWithdrawalUpdateWithoutWalletInput, GameWithdrawalUncheckedUpdateWithoutWalletInput>
  }

  export type GameWithdrawalUpdateManyWithWhereWithoutWalletInput = {
    where: GameWithdrawalScalarWhereInput
    data: XOR<GameWithdrawalUpdateManyMutationInput, GameWithdrawalUncheckedUpdateManyWithoutWalletInput>
  }

  export type GameWithdrawalScalarWhereInput = {
    AND?: GameWithdrawalScalarWhereInput | GameWithdrawalScalarWhereInput[]
    OR?: GameWithdrawalScalarWhereInput[]
    NOT?: GameWithdrawalScalarWhereInput | GameWithdrawalScalarWhereInput[]
    id?: StringFilter<"GameWithdrawal"> | string
    walletId?: StringFilter<"GameWithdrawal"> | string
    userId?: StringFilter<"GameWithdrawal"> | string
    amount?: IntFilter<"GameWithdrawal"> | number
    method?: StringFilter<"GameWithdrawal"> | string
    accountNumber?: StringFilter<"GameWithdrawal"> | string
    accountName?: StringFilter<"GameWithdrawal"> | string
    status?: EnumGameWithdrawalStatusFilter<"GameWithdrawal"> | $Enums.GameWithdrawalStatus
    rejectionReason?: StringNullableFilter<"GameWithdrawal"> | string | null
    submittedAt?: DateTimeFilter<"GameWithdrawal"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"GameWithdrawal"> | Date | string | null
    reviewedBy?: StringNullableFilter<"GameWithdrawal"> | string | null
  }

  export type GameWalletCreateWithoutDepositsInput = {
    id?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGameWalletInput
    sessions?: GameSessionCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalCreateNestedManyWithoutWalletInput
  }

  export type GameWalletUncheckedCreateWithoutDepositsInput = {
    id?: string
    userId: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: GameSessionUncheckedCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalUncheckedCreateNestedManyWithoutWalletInput
  }

  export type GameWalletCreateOrConnectWithoutDepositsInput = {
    where: GameWalletWhereUniqueInput
    create: XOR<GameWalletCreateWithoutDepositsInput, GameWalletUncheckedCreateWithoutDepositsInput>
  }

  export type GameWalletUpsertWithoutDepositsInput = {
    update: XOR<GameWalletUpdateWithoutDepositsInput, GameWalletUncheckedUpdateWithoutDepositsInput>
    create: XOR<GameWalletCreateWithoutDepositsInput, GameWalletUncheckedCreateWithoutDepositsInput>
    where?: GameWalletWhereInput
  }

  export type GameWalletUpdateToOneWithWhereWithoutDepositsInput = {
    where?: GameWalletWhereInput
    data: XOR<GameWalletUpdateWithoutDepositsInput, GameWalletUncheckedUpdateWithoutDepositsInput>
  }

  export type GameWalletUpdateWithoutDepositsInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGameWalletNestedInput
    sessions?: GameSessionUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletUncheckedUpdateWithoutDepositsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: GameSessionUncheckedUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletCreateWithoutSessionsInput = {
    id?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGameWalletInput
    deposits?: GameDepositCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalCreateNestedManyWithoutWalletInput
  }

  export type GameWalletUncheckedCreateWithoutSessionsInput = {
    id?: string
    userId: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: GameDepositUncheckedCreateNestedManyWithoutWalletInput
    withdrawals?: GameWithdrawalUncheckedCreateNestedManyWithoutWalletInput
  }

  export type GameWalletCreateOrConnectWithoutSessionsInput = {
    where: GameWalletWhereUniqueInput
    create: XOR<GameWalletCreateWithoutSessionsInput, GameWalletUncheckedCreateWithoutSessionsInput>
  }

  export type GameWalletUpsertWithoutSessionsInput = {
    update: XOR<GameWalletUpdateWithoutSessionsInput, GameWalletUncheckedUpdateWithoutSessionsInput>
    create: XOR<GameWalletCreateWithoutSessionsInput, GameWalletUncheckedCreateWithoutSessionsInput>
    where?: GameWalletWhereInput
  }

  export type GameWalletUpdateToOneWithWhereWithoutSessionsInput = {
    where?: GameWalletWhereInput
    data: XOR<GameWalletUpdateWithoutSessionsInput, GameWalletUncheckedUpdateWithoutSessionsInput>
  }

  export type GameWalletUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGameWalletNestedInput
    deposits?: GameDepositUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: GameDepositUncheckedUpdateManyWithoutWalletNestedInput
    withdrawals?: GameWithdrawalUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletCreateWithoutWithdrawalsInput = {
    id?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGameWalletInput
    deposits?: GameDepositCreateNestedManyWithoutWalletInput
    sessions?: GameSessionCreateNestedManyWithoutWalletInput
  }

  export type GameWalletUncheckedCreateWithoutWithdrawalsInput = {
    id?: string
    userId: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    deposits?: GameDepositUncheckedCreateNestedManyWithoutWalletInput
    sessions?: GameSessionUncheckedCreateNestedManyWithoutWalletInput
  }

  export type GameWalletCreateOrConnectWithoutWithdrawalsInput = {
    where: GameWalletWhereUniqueInput
    create: XOR<GameWalletCreateWithoutWithdrawalsInput, GameWalletUncheckedCreateWithoutWithdrawalsInput>
  }

  export type GameWalletUpsertWithoutWithdrawalsInput = {
    update: XOR<GameWalletUpdateWithoutWithdrawalsInput, GameWalletUncheckedUpdateWithoutWithdrawalsInput>
    create: XOR<GameWalletCreateWithoutWithdrawalsInput, GameWalletUncheckedCreateWithoutWithdrawalsInput>
    where?: GameWalletWhereInput
  }

  export type GameWalletUpdateToOneWithWhereWithoutWithdrawalsInput = {
    where?: GameWalletWhereInput
    data: XOR<GameWalletUpdateWithoutWithdrawalsInput, GameWalletUncheckedUpdateWithoutWithdrawalsInput>
  }

  export type GameWalletUpdateWithoutWithdrawalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGameWalletNestedInput
    deposits?: GameDepositUpdateManyWithoutWalletNestedInput
    sessions?: GameSessionUpdateManyWithoutWalletNestedInput
  }

  export type GameWalletUncheckedUpdateWithoutWithdrawalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    balance?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deposits?: GameDepositUncheckedUpdateManyWithoutWalletNestedInput
    sessions?: GameSessionUncheckedUpdateManyWithoutWalletNestedInput
  }

  export type ApplicationCreateManyUserInput = {
    id?: string
    jobId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedJobCreateManyUserInput = {
    id?: string
    jobId: string
    savedAt?: Date | string
  }

  export type AlertCreateManyUserInput = {
    id?: string
    keywords: string
    location?: string
    type?: string
    frequency?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    body: string
    type?: string
    read?: boolean
    link?: string | null
    createdAt?: Date | string
  }

  export type ApplicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutApplicationsNestedInput
    payment?: PaymentUpdateOneWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUncheckedUpdateOneWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutSavedByNestedInput
  }

  export type SavedJobUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    frequency?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    link?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyJobInput = {
    id?: string
    userId: string
    cvUrl: string
    status?: $Enums.ApplicationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedJobCreateManyJobInput = {
    id?: string
    userId: string
    savedAt?: Date | string
  }

  export type ApplicationUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
    payment?: PaymentUpdateOneWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUncheckedUpdateOneWithoutApplicationNestedInput
  }

  export type ApplicationUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cvUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedJobsNestedInput
  }

  export type SavedJobUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedJobUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameDepositCreateManyWalletInput = {
    id?: string
    userId: string
    amount: number
    method: $Enums.PaymentMethod
    screenshotUrl: string
    status?: $Enums.GameDepositStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameSessionCreateManyWalletInput = {
    id?: string
    userId: string
    wagerAmount: number
    finalScore?: number
    winAmount?: number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    endedAt?: Date | string | null
    completed?: boolean
  }

  export type GameWithdrawalCreateManyWalletInput = {
    id?: string
    userId: string
    amount: number
    method: string
    accountNumber: string
    accountName: string
    status?: $Enums.GameWithdrawalStatus
    rejectionReason?: string | null
    submittedAt?: Date | string
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
  }

  export type GameDepositUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameDepositUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameDepositUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    screenshotUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumGameDepositStatusFieldUpdateOperationsInput | $Enums.GameDepositStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameSessionUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameSessionUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameSessionUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wagerAmount?: IntFieldUpdateOperationsInput | number
    finalScore?: IntFieldUpdateOperationsInput | number
    winAmount?: IntFieldUpdateOperationsInput | number
    milestones?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameWithdrawalUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameWithdrawalUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameWithdrawalUncheckedUpdateManyWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    status?: EnumGameWithdrawalStatusFieldUpdateOperationsInput | $Enums.GameWithdrawalStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}