# TypeScript Decisions

## Enabled Options

### strict
Enabled because it provides stronger type checking and catches common mistakes.

### strictNullChecks
Enabled to prevent assigning null or undefined to types that do not allow them.

### noImplicitAny
Enabled to prevent variables and function parameters from silently becoming any.

### strictFunctionTypes
Enabled to check function parameter types more strictly.

### strictPropertyInitialization
Enabled to make sure class properties are initialized.

### useUnknownInCatchVariables
Enabled so caught errors are treated as unknown and checked before use.

### noImplicitThis
Enabled to catch unsafe or unclear this usage.

### alwaysStrict
Enabled to use JavaScript strict mode.

### noUncheckedIndexedAccess
Enabled because array/object index access can return undefined.