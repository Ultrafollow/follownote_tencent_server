'use client';
import React from 'react';
import { Tree } from 'antd';
const { DirectoryTree } = Tree;

export const TreeWrapper = ({ treeData, ...props }) => {
    const onSelect = (keys, info) => {
        console.log('Trigger Select', keys, info);
      };
      const onExpand = (keys, info) => {
        console.log('Trigger Expand', keys, info);
      };
      return (
        <DirectoryTree
          multiple
          draggable
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
        />
    );
  };