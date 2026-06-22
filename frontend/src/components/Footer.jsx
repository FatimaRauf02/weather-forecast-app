export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/20 pt-8 pb-12">
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <h4 className="font-display font-bold text-lg mb-2 text-white text-shadow-soft">
            Waypoint Weather
          </h4>
          <p className="text-sm text-white/85 leading-relaxed">
            Built by <span className="text-white font-semibold">Fatima</span> as a technical
            assessment for the AI Engineer Intern role at PM Accelerator.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs uppercase tracking-wide text-white/70 font-semibold mb-2">
            About PM Accelerator
          </h4>
          <p className="text-sm text-white/85 leading-relaxed">
            The Product Manager Accelerator Program is designed to support PM professionals
            through every stage of their careers. From students looking to break into the
            field, to Directors looking to take on a leadership role, our program has helped
            over hundreds of students fulfill their career aspirations.
          </p>
          <p className="text-sm text-white/85 leading-relaxed mt-2">
            Our Product Manager Accelerator community helps PMs find their next career
            opportunity and contributes to their long-term success, offering services from
            mock interviews to comprehensive product management training.
          </p>
          <a
            href="https://www.linkedin.com/company/product-manager-accelerator/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sun font-semibold inline-block mt-2 hover:underline"
          >
            PM Accelerator on LinkedIn →
          </a>
        </div>
      </div>
    </footer>
  );
}
