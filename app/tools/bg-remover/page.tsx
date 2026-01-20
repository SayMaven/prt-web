import BackgroundRemover from "@/components/tools/BackgroundRemover";

export default function BgRemoverPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Maven Background Remover</h1>
        <p className="text-slate-400">
           Tools penghapus background berbasis AI yang berjalan 100% di browser kamu. 
           Tanpa upload server, tanpa batasan kuota.
        </p>
      </div>
      
      <BackgroundRemover />
    </div>
  );
}