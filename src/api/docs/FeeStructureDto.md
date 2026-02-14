# FeeStructureDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**academicYear** | **string** |  | [default to undefined]
**frequency** | **string** |  | [default to undefined]
**lateFeeAmount** | **number** |  | [optional] [default to undefined]
**gracePeriodDays** | **number** |  | [optional] [default to undefined]
**items** | [**Array&lt;FeeStructureItemDto&gt;**](FeeStructureItemDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { FeeStructureDto } from './api';

const instance: FeeStructureDto = {
    id,
    name,
    academicYear,
    frequency,
    lateFeeAmount,
    gracePeriodDays,
    items,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
