
import { SoapNote } from "@/types/medical";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SoapNoteViewerProps {
  soapNote: SoapNote;
  title?: string;
}

const SoapNoteViewer = ({ soapNote, title = "SOAP Note" }: SoapNoteViewerProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullNote = `
SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}
    `.trim();
    
    navigator.clipboard.writeText(fullNote)
      .then(() => {
        setCopied(true);
        toast.success("SOAP note copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const handleDownload = () => {
    const fullNote = `
SOAP NOTE
${new Date().toLocaleString()}

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}
    `.trim();
    
    const blob = new Blob([fullNote], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOAP_Note_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SOAP note downloaded");
  };

  return (
    <Card className="border shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>AI-generated clinical documentation</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="h-8"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="h-8"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subjective">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="subjective">Subjective</TabsTrigger>
            <TabsTrigger value="objective">Objective</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="subjective" className="mt-0">
            <Card className="border">
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{soapNote.subjective}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="objective" className="mt-0">
            <Card className="border">
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{soapNote.objective}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="assessment" className="mt-0">
            <Card className="border">
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{soapNote.assessment}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plan" className="mt-0">
            <Card className="border">
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{soapNote.plan}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SoapNoteViewer;
