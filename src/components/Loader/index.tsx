import styles from './styles.module.css';

const balls: number[] = [];

for (let i = 1; i <= 20; i++) {
  balls.push(i);
}

export function Loader() {
  return (
    <div className={styles.loader}>
      <div>
        {balls.map((ball, index) => (
          <span
            className={styles.ball}
            key={ball}
            style={{ ['--ball-number' as any]: index }}
          ></span>
        ))}
      </div>
    </div>
  );
}
