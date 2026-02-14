# StudentLedgerDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**studentId** | **number** |  | [optional] [default to undefined]
**totalDues** | **number** |  | [optional] [default to undefined]
**totalPaid** | **number** |  | [optional] [default to undefined]
**pendingBalance** | **number** |  | [optional] [default to undefined]
**lateFees** | **number** |  | [optional] [default to undefined]
**dues** | [**Array&lt;LedgerEntryDto&gt;**](LedgerEntryDto.md) |  | [optional] [default to undefined]
**transactions** | [**Array&lt;PaymentTransactionDto&gt;**](PaymentTransactionDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StudentLedgerDto } from './api';

const instance: StudentLedgerDto = {
    studentId,
    totalDues,
    totalPaid,
    pendingBalance,
    lateFees,
    dues,
    transactions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
