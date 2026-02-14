# Teacher


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**user** | [**User**](User.md) |  | [optional] [default to undefined]
**email** | **string** |  | [default to undefined]
**phone** | **string** |  | [default to undefined]
**qualification** | **string** |  | [optional] [default to undefined]
**profileImage** | **string** |  | [optional] [default to undefined]
**specializations** | [**Set&lt;Subject&gt;**](Subject.md) |  | [optional] [default to undefined]
**deleted** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { Teacher } from './api';

const instance: Teacher = {
    createdAt,
    updatedAt,
    id,
    name,
    user,
    email,
    phone,
    qualification,
    profileImage,
    specializations,
    deleted,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
