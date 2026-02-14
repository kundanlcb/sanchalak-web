# TimetableDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**studentId** | **number** |  | [optional] [default to undefined]
**className** | **string** |  | [optional] [default to undefined]
**academicYear** | **string** |  | [optional] [default to undefined]
**weeklySchedule** | **{ [key: string]: Array&lt;PeriodDto&gt;; }** |  | [optional] [default to undefined]

## Example

```typescript
import { TimetableDto } from './api';

const instance: TimetableDto = {
    studentId,
    className,
    academicYear,
    weeklySchedule,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
