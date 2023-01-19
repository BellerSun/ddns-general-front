import React from 'react';
import styles from './ConfigMain.less';
import BaseLayout from "@/pages/BaseLayout";

export default function Page() {
  return (
    <BaseLayout>
      <div>
        <h1 className={styles.title}>Page DDNS/ConfigMain</h1>
      </div>
    </BaseLayout>
  );
}
