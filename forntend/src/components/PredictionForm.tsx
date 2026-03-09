import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Loader2 } from "lucide-react";

interface FormData {
  age: string;
  sex: string;
  patientCohort: string;
  sampleOrigin: string;
  stage: string;
  plasmaCA19_9: string;
  creatinine: string;
  lyve1: string;
  reg1a: string;
  reg1b: string;
  tff1: string;
}

interface PredictionFormProps {
  onPredict: (data: FormData) => void;
  isLoading: boolean;
}

const PredictionForm = ({ onPredict, isLoading }: PredictionFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    age: "",
    sex: "",
    patientCohort: "",
    sampleOrigin: "",
    stage: "",
    plasmaCA19_9: "",
    creatinine: "",
    lyve1: "",
    reg1a: "",
    reg1b: "",
    tff1: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Patient Information */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">1</span>
          Patient Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-muted-foreground">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 55"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-sm font-medium text-muted-foreground">Sex</Label>
            <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)} required>
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Female</SelectItem>
                <SelectItem value="1">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cohort" className="text-sm font-medium text-muted-foreground">Patient Cohort</Label>
            <Select value={formData.patientCohort} onValueChange={(value) => handleInputChange("patientCohort", value)} required>
              <SelectTrigger id="cohort">
                <SelectValue placeholder="Select cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Cohort 1</SelectItem>
                <SelectItem value="2">Cohort 2</SelectItem>
                <SelectItem value="3">Cohort 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium text-muted-foreground">Sample Origin</Label>
            <Select value={formData.sampleOrigin} onValueChange={(value) => handleInputChange("sampleOrigin", value)} required>
              <SelectTrigger id="origin">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">BPTB</SelectItem>
                <SelectItem value="2">LIV</SelectItem>
                <SelectItem value="3">UCL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Clinical Information */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
          Clinical Stage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-sm font-medium text-muted-foreground">Disease Stage</Label>
            <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)} required>
              <SelectTrigger id="stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Not Applicable</SelectItem>
                <SelectItem value="1">Stage I</SelectItem>
                <SelectItem value="2">Stage II</SelectItem>
                <SelectItem value="3">Stage III</SelectItem>
                <SelectItem value="4">Stage IV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Biomarker Values */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">3</span>
          Biomarker Values
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ca19" className="text-sm font-medium text-muted-foreground">Plasma CA19-9 (U/mL)</Label>
            <Input
              id="ca19"
              type="number"
              step="0.01"
              placeholder="e.g., 25.5"
              value={formData.plasmaCA19_9}
              onChange={(e) => handleInputChange("plasmaCA19_9", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creatinine" className="text-sm font-medium text-muted-foreground">Creatinine (mg/dL)</Label>
            <Input
              id="creatinine"
              type="number"
              step="0.01"
              placeholder="e.g., 1.2"
              value={formData.creatinine}
              onChange={(e) => handleInputChange("creatinine", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lyve1" className="text-sm font-medium text-muted-foreground">LYVE1 (ng/mL)</Label>
            <Input
              id="lyve1"
              type="number"
              step="0.001"
              placeholder="e.g., 2.345"
              value={formData.lyve1}
              onChange={(e) => handleInputChange("lyve1", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg1a" className="text-sm font-medium text-muted-foreground">REG1A (ng/mL)</Label>
            <Input
              id="reg1a"
              type="number"
              step="0.001"
              placeholder="e.g., 3.456"
              value={formData.reg1a}
              onChange={(e) => handleInputChange("reg1a", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg1b" className="text-sm font-medium text-muted-foreground">REG1B (ng/mL)</Label>
            <Input
              id="reg1b"
              type="number"
              step="0.001"
              placeholder="e.g., 4.567"
              value={formData.reg1b}
              onChange={(e) => handleInputChange("reg1b", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tff1" className="text-sm font-medium text-muted-foreground">TFF1 (ng/mL)</Label>
            <Input
              id="tff1"
              type="number"
              step="0.001"
              placeholder="e.g., 1.234"
              value={formData.tff1}
              onChange={(e) => handleInputChange("tff1", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Button
          type="submit"
          variant="medical"
          size="xl"
          className="w-full md:w-auto min-w-[200px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity className="w-5 h-5" />
              Predict Diagnosis
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PredictionForm;
