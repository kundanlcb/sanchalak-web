# BulkMarkAttendanceRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**classId** | **number** |  | [optional] [default to undefined]
**date** | **string** |  | [optional] [default to undefined]
**attendances** | [**Array&lt;StudentAttendanceStatus&gt;**](StudentAttendanceStatus.md) |  | [optional] [default to undefined]
**markedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { BulkMarkAttendanceRequest } from './api';

const instance: BulkMarkAttendanceRequest = {
    classId,
    date,
    attendances,
    markedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
