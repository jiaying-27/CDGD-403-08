import BallpitStage from '../components/BallpitStage';
import EnterExperienceButton from '../components/EnterExperienceButton';

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-stage home-stage-fullscreen">
        <BallpitStage />

        <div className="home-copy home-copy-demo">
          <h1 className="home-title">What is your current state?</h1>

          <div className="home-copy-body">
            <p>An atmospheric threshold into sound and stillness.</p>
            <EnterExperienceButton />
          </div>
        </div>
      </section>
    </main>
  );
}
