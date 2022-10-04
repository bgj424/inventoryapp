import React from 'react'
import { PasswordChangeDialog } from './PasswordChangeDialog';
import { ReAuthDialog } from './ReAuthDialog';
import { PasswordResetDialog } from './PasswordResetDialog';
import { InfoDialog } from './InfoDialog';

/**
 * @param props.visibleDialog passwordchange/reauthenticate/passwordreset/info
 * @param props.changeVisibleDialog function to handle dialog change
 * @param props.dialogMessage infodialog message and title
 */

export const AuthDialogsComponent = (props) => {
  return(
    <>
      <PasswordChangeDialog
        visibleDialog={props.visibleDialog}
        changeVisibleDialog={props.changeVisibleDialog}
      />
      <ReAuthDialog
        visibleDialog={props.visibleDialog}
        changeVisibleDialog={props.changeVisibleDialog}
      />
      <PasswordResetDialog
        visibleDialog={props.visibleDialog}
        changeVisibleDialog={props.changeVisibleDialog}
      />
      <InfoDialog
        visibleDialog={props.visibleDialog}
        changeVisibleDialog={props.changeVisibleDialog}
        title={props.dialogMessage.title}
        message={props.dialogMessage.message}
        icon={props.dialogMessage.icon}
      />
    </>
  )
}