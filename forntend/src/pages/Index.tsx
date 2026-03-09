import { useState } from "react";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import { Stethoscope, BarChart3 } from "lucide-react";

interface PredictionResultData {
  prediction: "healthy" | "benign" | "cancer";
  probabilities: {
    healthy: number;
    benign: number;
    cancer: number;
  };
  model: string;
  confidence: number;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResultData | null>(null);

  const handlePredict = async (formData: any) => {
    setIsLoading(true);
    setResult(null);

    try {
      // EXACT FEATURE ORDER (7 features)
      const features = [
        Number(formData.age) || 0,
        Number(formData.plasmaCA19_9) || 0,
        Number(formData.creatinine) || 0,
        Number(formData.lyve1) || 0,
        Number(formData.reg1a) || 0,
        Number(formData.reg1b) || 0,
        Number(formData.tff1) || 0,
      ];

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      const predictionMap: any = {
        0: "healthy",
        1: "benign",
        2: "cancer",
      };

      const label = predictionMap[data.prediction];

      setResult({
        prediction: label,
        probabilities: {
          healthy: label === "healthy" ? 0.9 : 0.05,
          benign: label === "benign" ? 0.9 : 0.05,
          cancer: label === "cancer" ? 0.9 : 0.05,
        },
        model: data.best_model,
        confidence: data.confidence,
      });
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold">PancreoScan</h1>
            <p className="text-xs text-muted-foreground">
              AI-Powered Early Detection
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-card rounded-xl p-6 border">
            <h3 className="text-lg font-bold mb-4">
              Enter Patient Biomarkers
            </h3>
            <PredictionForm
              onPredict={handlePredict}
              isLoading={isLoading}
            />
          </div>

          <div>
            {result ? (
              <PredictionResult result={result} />
            ) : (
              <div className="bg-card rounded-xl p-8 border text-center">
                <BarChart3 className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fill the form and click Predict
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Based on Debernardi et al. (2020) pancreatic cancer biomarker dataset.
      </footer>
    </div>
  );
};

export default Index;
