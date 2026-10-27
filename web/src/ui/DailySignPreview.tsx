export default function DailySignPreview({ large = false }: { large?: boolean }) {
  return <div className={'daily-preview ' + (large ? 'large' : '')} aria-hidden="true"><span className="daily-orbit" /><div className="daily-paper"><span className="daily-meta">DAILY SIGN / No 077</span><strong>签</strong><span className="daily-line" /><p>把普通的一天，<br />认真看一眼</p><span className="daily-seal">今日</span></div><span className="daily-preview-caption">AN ORDINARY DAY, NOTICED</span></div>
}
