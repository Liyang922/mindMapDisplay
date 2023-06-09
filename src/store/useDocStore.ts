import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import useHttp from '@/hooks/useHttp';
import useUserStore from '@/store/useUserStore';
import API from '@/utils/api';

export interface Doc {
  createTime: number;
  folderId: string;
  folderType?: number;
  id: string;
  name: string;
  updateTime: number;
  userId: string;
  _id: string;
}
interface DocRes {
  documents: Doc[];
  folders: Doc[];
}

/* eslint-disable no-unused-vars */
interface DocStoreProps {
  docs: DocRes | undefined;
  getDocsById: (folderId: string) => Doc[] | undefined;
  getFolderNameById: (folderId: string) => string;
  getDocsByDate: () => Doc[] | undefined;
  fetchAllDocs: () => Promise<void>;
}

// 创建store
const useStore = create<DocStoreProps>()(
  devtools(
    persist(
      (set, get) => ({
        docs: undefined,
        getDocsById: (folderId = '0') => {
          const all = get().docs;
          if (!folderId || !all) return undefined;
          const sourceList = [...all.folders, ...all.documents];
          return sourceList.filter((doc) => doc.folderId === folderId);
        },
        getFolderNameById: (folderId: string) => {
          if (folderId === '0') return '所有文件';
          const target = get().docs?.folders.find((item) => item.id === folderId);
          return target ? target.name : '所有文件';
        },
        getDocsByDate: () => {
          const all_doc = get().docs?.documents;
          return all_doc?.sort((a, b) => b.updateTime - a.updateTime);
        },
        fetchAllDocs: async () => {
          const user = useUserStore.getState().user;
          const url = `${API.getAllDocs}/${user?._id}`;
          const res = await useHttp<DocRes>(url);
          if (res) {
            set({ docs: res });
          } else {
            // 错误处理
            console.log(res);
          }
        },
      }),
      { name: 's-docs' },
    ),
  ),
);

export default useStore;
