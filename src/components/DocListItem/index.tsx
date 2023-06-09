import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import type { Doc } from '@/store/useDocStore';
import { dateFormat } from '@/utils/date';

import styles from './index.module.less';

function DocListItem(props: any) {
  // function DocListItem(doc: Doc) {
  const doc: Doc = props.doc;
  const isFolder = 'folderType' in doc; //in——属性是否存在
  console.log('DocListItem', doc, props);

  return (
    <div className={styles.item}>
      <div className={styles.icon}>
        <SvgIcon name={isFolder ? 'folder-large' : 'file-large'} />
      </div>
      <Link
        to={`/${isFolder ? 'app' : 'edit'}/${doc.id}`}
        key={doc.id}
        className={styles.link}
      >
        <span className={styles.name}>{doc.name}</span>
        <span className={styles.date}>{dateFormat(doc.updateTime)}</span>
      </Link>
      <div className={styles.more}>
        <SvgIcon name="more" />
      </div>
    </div>
  );
}

export default memo(DocListItem);
