import { homePrimaryColor } from '@/utils/constants';
import { Button, ConfigProvider } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

interface FAQProps {
  stepIndex?: number;
  faqData?: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string | string[];
}

const useStyles = createStyles(({ token, css }) => ({
  faqSection: css`
    width: calc(100% - 13px);
  `,
  faqHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px 14px;
    border-bottom: 1px solid rgba(242, 242, 242, 0.1);

    h3 {
      margin: 0;
      color: ${homePrimaryColor};
      font-size: 24px;

      span {
        margin-left: 8px;
        color: ${homePrimaryColor};
        font-weight: normal;
      }
    }
  `,
  faqContent: css`
    padding: 20px 40px;
    background: #f3f6ff;
    margin-bottom: 16px;
  `,
  questionItem: css`
    margin-bottom: 24px;

    .question {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      color: ${token.colorText};
      font-size: 16px;

      .number {
        margin-right: 8px;
        color: ${homePrimaryColor};
        font-weight: bold;
      }
    }

    .answer {
      position: relative;
      margin-bottom: 8px;
      padding-left: 24px;
      color: ${token.colorText};

      &::before {
        position: absolute;
        left: 0;
        opacity: 0.7;
        content: '👉';
      }
    }
  `,
  viewMore: css`
    padding: 4px 16px;
    border-radius: 4px;
    color: ${token.colorPrimary};
    border: 1px solid ${token.colorPrimary};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #fff;
      background: ${token.colorPrimary};
    }
  `,
}));

const FAQ: React.FC<FAQProps> = ({ stepIndex, faqData = [] }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.faqSection}>
      <div className={styles.faqHeader}>
        <h3>
          快速上手 <span>|</span> FAQ
        </h3>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: homePrimaryColor,
            },
          }}
        >
          <Button
            onClick={() => {
              window.open(`/home/faqs/${stepIndex}`);
            }}
          >
            查看更多
          </Button>
        </ConfigProvider>

        {/*<button type="button" className={styles.viewMore}>*/}
        {/*  查看更多*/}
        {/*</button>*/}
      </div>
      <div className={styles.faqContent}>
        {faqData.slice(0, 2).map((faq, index) => (
          <div key={index} className={styles.questionItem}>
            <div className="question">
              <span className="number">{index + 1}.</span>
              <span>{faq.question}</span>
            </div>

            {Array.isArray(faq.answer) ? (
              faq.answer?.map((item, index) => (
                <div
                  className="answer"
                  key={index}
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))
            ) : (
              <div
                className="answer"
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
