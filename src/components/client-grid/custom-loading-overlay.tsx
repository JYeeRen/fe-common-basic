import { Spin } from 'antd';
import { CustomLoadingOverlayProps } from 'ag-grid-react';

export const CustomLoadingOverlay = (props: CustomLoadingOverlayProps & { loadingMessage: string }) => {
    return (
      <>
        <Spin spinning={true} size="large" />
        <p>{props.loadingMessage}</p>
      </>
    );
};