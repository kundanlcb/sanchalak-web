# ClassAttendanceSheetDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**classId** | **number** |  | [optional] [default to undefined]
**date** | **string** |  | [optional] [default to undefined]
**presentCount** | **number** |  | [optional] [default to undefined]
**absentCount** | **number** |  | [optional] [default to undefined]
**totalCount** | **number** |  | [optional] [default to undefined]
**students** | [**Array&lt;AttendanceRecordDto&gt;**](AttendanceRecordDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ClassAttendanceSheetDto } from './api';

const instance: ClassAttendanceSheetDto = {
    classId,
    date,
    presentCount,
    absentCount,
    totalCount,
    students,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
