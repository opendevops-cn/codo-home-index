import { Box } from '@mui/material';
import { Col, Row, Space } from 'antd';
import { forwardRef, useLayoutEffect } from 'react';
import type { Application } from '../data';
import { ComponentCard } from './ComponentCard';

export const ComponentList = forwardRef(
  (
    props: {
      components: ({
        id: string;
        classifyName: string;
        hash: string;

        childrenClassifyList: Application[];
      } | null)[];
      onLoad: Function;
      onUpdateFavorite?: (app: Application) => void;
      onUpdateRecentVisited?: (appId: number) => void;
    },
    ref,
  ) => {
    const { components, onLoad, onUpdateFavorite, onUpdateRecentVisited } = props;

    useLayoutEffect(() => {
      onLoad();
    }, [onLoad]);
    return (
      <Box
        sx={{
          ml: '10px',
        }}
        ref={ref}
      >
        {components.map(
          (item, index) =>
            item && (
              <Box
                key={item.id}
                sx={{
                  minHeight: index === components.length - 1 ? '800px' : 'auto',
                  mb: '40px',
                }}
              >
                <Box
                  id={item.hash}
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '24px',
                    mb: '12px',
                    // mt: '12px',
                  }}
                >
                  {item.classifyName}
                </Box>
                <Row gutter={[16, 16]}>
                  {item.childrenClassifyList?.map((component) => (
                    <div key={component.id}>
                      <Col key={component.id} flex="339px">
                        <ComponentCard
                          entryData={component}
                          onUpdateFavorite={onUpdateFavorite}
                          onUpdateRecentVisited={onUpdateRecentVisited}
                        />
                      </Col>
                    </div>
                  ))}
                </Row>
              </Box>
            ),
        )}
      </Box>
    );
  },
);
