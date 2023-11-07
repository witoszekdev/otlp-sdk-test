// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { SeverityNumber } from "@opentelemetry/api-logs";

// exporter options. see all options in OTLPExporterNodeConfigBase
const collectorOptions = {
  url: "https://otel.plur.tech/v1/traces", // url is optional and can be omitted - default is http://localhost:4318/v1/logs
  concurrencyLimit: 1, // an optional limit on pending requests
};
const logExporter = new OTLPLogExporter(collectorOptions);
const loggerProvider = new LoggerProvider();

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

const logger = loggerProvider.getLogger("default", "1.0.0");

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // Emit a log
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "info",
    body: "this is a log body",
    attributes: { "log.type": "custom" },
  });
  res.status(200).json({ name: "John Doe" });
}
